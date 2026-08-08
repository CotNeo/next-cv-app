import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TEMPLATE,
  TEMPLATE_IDS,
  categories,
  getTemplateById,
  isTemplateId,
  templates,
  toTemplateId,
} from '@/data/templates';

describe('template catalogue', () => {
  it('lists one entry per template id, with no duplicates', () => {
    expect(templates).toHaveLength(TEMPLATE_IDS.length);
    expect(new Set(templates.map((t) => t.id)).size).toBe(TEMPLATE_IDS.length);
  });

  it('counts categories consistently with the catalogue', () => {
    const all = categories.find((c) => c.name === 'all');
    expect(all?.count).toBe(templates.length);

    const summed = categories
      .filter((c) => c.name !== 'all')
      .reduce((total, c) => total + c.count, 0);
    expect(summed).toBe(templates.length);
  });

  it('resolves a known id and rejects an unknown one', () => {
    expect(getTemplateById('modern')?.name).toBe('Modern');
    expect(getTemplateById('nope')).toBeUndefined();
  });
});

describe('toTemplateId', () => {
  it('passes through valid ids', () => {
    for (const id of TEMPLATE_IDS) expect(toTemplateId(id)).toBe(id);
  });

  it('falls back to the default for anything else', () => {
    expect(toTemplateId('hacker')).toBe(DEFAULT_TEMPLATE);
    expect(toTemplateId(undefined)).toBe(DEFAULT_TEMPLATE);
    expect(toTemplateId(null)).toBe(DEFAULT_TEMPLATE);
    expect(toTemplateId(42)).toBe(DEFAULT_TEMPLATE);
  });
});

describe('isTemplateId', () => {
  it('narrows only exact matches', () => {
    expect(isTemplateId('modern')).toBe(true);
    expect(isTemplateId('Modern')).toBe(false);
    expect(isTemplateId({})).toBe(false);
  });
});
