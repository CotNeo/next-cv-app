'use client';

import { useCallback } from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { defaultLocale, type ValidLocale } from '@/i18n/settings';

import en from '@/i18n/translations/en.json';
import tr from '@/i18n/translations/tr.json';
import de from '@/i18n/translations/de.json';
import ru from '@/i18n/translations/ru.json';
import ar from '@/i18n/translations/ar.json';
import fr from '@/i18n/translations/fr.json';

type Translations = typeof en;

const translations: Record<ValidLocale, Translations> = { en, tr, de, ru, ar, fr };

export type TranslateParams = Record<string, string | number>;

function lookup(locale: ValidLocale, key: string): string | undefined {
  let value: unknown = translations[locale];
  for (const part of key.split('.')) {
    if (typeof value !== 'object' || value === null || !(part in value)) return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export type Translate = (key: string, params?: TranslateParams) => string;

/**
 * Translation hook. Reads the active locale from LocaleProvider; pass `override`
 * only when a subtree must render in a different language than the interface
 * (for example a CV written in English inside a Turkish dashboard).
 */
export function useTranslation(override?: ValidLocale) {
  const { locale: contextLocale, setLocale } = useLocale();
  const locale = override ?? contextLocale;

  const t = useCallback<Translate>(
    (key, params) => {
      // Fall back to English before giving up, so a gap in one locale still
      // shows readable text instead of a raw key.
      const value = lookup(locale, key) ?? lookup(defaultLocale, key);
      return value === undefined ? key : interpolate(value, params);
    },
    [locale]
  );

  return { t, locale, changeLocale: setLocale };
}
