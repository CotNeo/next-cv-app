import type { CVFormData } from '@/components/CVForm';

export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'references';

/** Every section, in the order a CV normally reads. */
export const ALL_SECTIONS: readonly SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'certifications',
  'projects',
  'references',
];

/**
 * Column assignment for the two-column templates.
 *
 * ASIDE and MAIN must together cover ALL_SECTIONS — a section missing from both
 * would silently vanish from those layouts, which is exactly the bug this split
 * replaced. `sectionCoverageGap()` guards the invariant and is asserted in tests.
 */
export const ASIDE_SECTIONS: readonly SectionKey[] = [
  'summary',
  'skills',
  'languages',
  'certifications',
];

export const MAIN_SECTIONS: readonly SectionKey[] = [
  'experience',
  'education',
  'projects',
  'references',
];

/** Section keys that no column would render. Empty means full coverage. */
export function sectionCoverageGap(): SectionKey[] {
  const covered = new Set<SectionKey>([...ASIDE_SECTIONS, ...MAIN_SECTIONS]);
  return ALL_SECTIONS.filter((key) => !covered.has(key));
}

export const nonEmpty = (value?: string): boolean => Boolean(value && value.trim());

/**
 * Returns the URL only when it is safe to put in an `href`.
 *
 * New input is validated on write, but CVs created before that check — or
 * rewritten by the AI — can still carry a `javascript:` URL, and rendering one
 * unguarded is stored XSS.
 */
export function safeHref(value?: string): string | undefined {
  if (!nonEmpty(value)) return undefined;
  try {
    const { protocol } = new URL(value!.trim());
    return protocol === 'http:' || protocol === 'https:' ? value!.trim() : undefined;
  } catch {
    return undefined;
  }
}

/** Whether a section has any data worth rendering a heading for. */
export function hasSection(key: SectionKey, data: CVFormData): boolean {
  switch (key) {
    case 'summary':
      return nonEmpty(data.summary);
    case 'experience':
      return (data.workExperience ?? []).some(
        (item) => nonEmpty(item.company) || nonEmpty(item.position)
      );
    case 'education':
      return (data.education ?? []).some(
        (item) => nonEmpty(item.institution) || nonEmpty(item.degree)
      );
    case 'skills':
      return (data.skills ?? []).some(nonEmpty);
    case 'languages':
      return (data.languages ?? []).some((item) => nonEmpty(item.language));
    case 'certifications':
      return (data.certifications ?? []).some((item) => nonEmpty(item.name));
    case 'projects':
      return (data.projects ?? []).some((item) => nonEmpty(item.name));
    case 'references':
      return (data.references ?? []).some((item) => nonEmpty(item.name));
  }
}

/** "March 2021 - Present", or an empty string when there is nothing to show. */
export function dateRange(
  start: string | undefined,
  end: string | undefined,
  isCurrent: boolean | undefined,
  format: (value?: string) => string,
  presentLabel: string
): string {
  const from = format(start);
  const to = isCurrent ? presentLabel : format(end);
  if (!from && !to) return '';
  if (!to) return from;
  if (!from) return to;
  return `${from} - ${to}`;
}
