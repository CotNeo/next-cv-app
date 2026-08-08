import { describe, expect, it } from 'vitest';
import { locales, type ValidLocale } from '@/i18n/settings';
import { getCVLabels, formatCVDate } from '@/i18n/cv-labels';
import { TEMPLATE_IDS } from '@/data/templates';

import en from '@/i18n/translations/en.json';
import tr from '@/i18n/translations/tr.json';
import de from '@/i18n/translations/de.json';
import ru from '@/i18n/translations/ru.json';
import ar from '@/i18n/translations/ar.json';
import fr from '@/i18n/translations/fr.json';

const bundles: Record<ValidLocale, unknown> = { en, tr, de, ru, ar, fr };

function flatten(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key)
  );
}

const reference = flatten(en).sort();

describe('translation bundles', () => {
  it.each(locales)('%s has exactly the same keys as en', (locale) => {
    expect(flatten(bundles[locale]).sort()).toEqual(reference);
  });

  it.each(locales)('%s has no blank values', (locale) => {
    const blanks: string[] = [];
    const walk = (value: unknown, prefix: string) => {
      if (typeof value === 'string') {
        if (value.trim() === '') blanks.push(prefix);
        return;
      }
      if (typeof value === 'object' && value !== null) {
        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
          walk(child, prefix ? `${prefix}.${key}` : key);
        }
      }
    };
    walk(bundles[locale], '');
    expect(blanks).toEqual([]);
  });

  it.each(locales)('%s describes every template', (locale) => {
    const keys = new Set(flatten(bundles[locale]));
    for (const id of TEMPLATE_IDS) {
      expect(keys).toContain(`home.templates.items.${id}.name`);
      expect(keys).toContain(`home.templates.items.${id}.description`);
    }
  });

  it.each(locales)('%s keeps the same interpolation placeholders as en', (locale) => {
    const placeholders = (bundle: unknown) => {
      const found = new Map<string, string[]>();
      const walk = (value: unknown, prefix: string) => {
        if (typeof value === 'string') {
          const names = [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
          if (names.length > 0) found.set(prefix, names);
          return;
        }
        if (typeof value === 'object' && value !== null) {
          for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
            walk(child, prefix ? `${prefix}.${key}` : key);
          }
        }
      };
      walk(bundle, '');
      return found;
    };

    const expected = placeholders(en);
    const actual = placeholders(bundles[locale]);
    for (const [key, names] of expected) {
      expect(actual.get(key), `${locale}: ${key}`).toEqual(names);
    }
  });
});

describe('CV labels', () => {
  it.each(locales)('%s translates every section heading', (locale) => {
    const labels = getCVLabels(locale);
    for (const [key, value] of Object.entries(labels)) {
      expect(value.trim(), `${locale}.${key}`).not.toBe('');
    }
  });

  it('falls back to English for an unknown locale', () => {
    expect(getCVLabels('xx' as ValidLocale).summary).toBe('Summary');
  });
});

describe('formatCVDate', () => {
  it('formats month and year in the CV language', () => {
    expect(formatCVDate('2021-03-15', 'en')).toMatch(/March/);
    expect(formatCVDate('2021-03-15', 'tr')).toMatch(/Mart/);
  });

  it('returns an empty string for missing or unparseable input', () => {
    expect(formatCVDate(undefined, 'en')).toBe('');
    expect(formatCVDate('', 'en')).toBe('');
    expect(formatCVDate('not a date', 'en')).toBe('');
  });
});
