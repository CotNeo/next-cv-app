import type { TemplateMeta } from '@/data/templates';

type Translate = (key: string) => string;

/** useTranslation returns the key itself when a string is missing. */
function translated(t: Translate, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function templateName(t: Translate, template: TemplateMeta): string {
  return translated(t, `home.templates.items.${template.id}.name`, template.name);
}

export function templateDescription(t: Translate, template: TemplateMeta): string {
  return translated(t, `home.templates.items.${template.id}.description`, '');
}

/** Matches a template against a search query in the user's own language. */
export function templateMatchesQuery(
  t: Translate,
  template: TemplateMeta,
  query: string
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    templateName(t, template).toLowerCase().includes(needle) ||
    templateDescription(t, template).toLowerCase().includes(needle) ||
    template.id.includes(needle) ||
    template.category.toLowerCase().includes(needle)
  );
}
