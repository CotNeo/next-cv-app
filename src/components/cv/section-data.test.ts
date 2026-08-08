import { describe, expect, it } from 'vitest';
import type { CVFormData } from '@/components/CVForm';
import {
  ALL_SECTIONS,
  dateRange,
  hasSection,
  safeHref,
  sectionCoverageGap,
} from '@/components/cv/section-data';

const emptyCV: CVFormData = {
  title: 'CV',
  personalInfo: { name: '', email: '', phone: '', location: '' },
  summary: '',
  workExperience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '' }],
  skills: [''],
  languages: [{ language: '', level: '' }],
  certifications: [],
  projects: [],
  references: [],
};

describe('section coverage', () => {
  it('renders every section in the two-column layouts', () => {
    // Guards the bug where languages/certifications/projects/references were
    // silently missing from most templates.
    expect(sectionCoverageGap()).toEqual([]);
  });

  it('lists all eight sections exactly once', () => {
    expect(new Set(ALL_SECTIONS).size).toBe(ALL_SECTIONS.length);
    expect(ALL_SECTIONS).toHaveLength(8);
  });
});

describe('hasSection', () => {
  it('treats a freshly initialised form as having nothing to show', () => {
    for (const key of ALL_SECTIONS) {
      expect(hasSection(key, emptyCV), key).toBe(false);
    }
  });

  it.each([
    ['summary', { summary: 'Experienced engineer' }],
    ['skills', { skills: ['', 'Go'] }],
    ['languages', { languages: [{ language: 'Turkish', level: 'C2' }] }],
    ['certifications', { certifications: [{ name: 'AWS', issuer: '', date: '' }] }],
    ['projects', { projects: [{ name: 'Site', description: '', technologies: [], startDate: '' }] }],
    ['references', { references: [{ name: 'Ada', position: '', company: '', email: '', phone: '' }] }],
  ] as const)('detects content in %s', (key, patch) => {
    expect(hasSection(key, { ...emptyCV, ...patch } as CVFormData)).toBe(true);
  });

  it('counts an experience entry with only a position', () => {
    const cv = {
      ...emptyCV,
      workExperience: [
        { company: '', position: 'Engineer', startDate: '', endDate: '', description: '' },
      ],
    };
    expect(hasSection('experience', cv)).toBe(true);
  });

  it('tolerates missing optional collections', () => {
    const sparse = { ...emptyCV, certifications: undefined, projects: undefined };
    expect(hasSection('certifications', sparse as CVFormData)).toBe(false);
    expect(hasSection('projects', sparse as CVFormData)).toBe(false);
  });
});

describe('safeHref', () => {
  it.each(['https://example.com', 'http://example.com/x?y=1'])('allows %s', (url) => {
    expect(safeHref(url)).toBe(url);
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'not a url',
    '',
    undefined,
  ])('rejects %s', (url) => {
    expect(safeHref(url as string | undefined)).toBeUndefined();
  });
});

describe('dateRange', () => {
  const fmt = (value?: string) => (value ? `[${value}]` : '');

  it('renders a closed range', () => {
    expect(dateRange('2020-01-01', '2022-01-01', false, fmt, 'Present')).toBe(
      '[2020-01-01] - [2022-01-01]'
    );
  });

  it('uses the present label when the entry is ongoing', () => {
    expect(dateRange('2020-01-01', '', true, fmt, 'Present')).toBe('[2020-01-01] - Present');
  });

  it('returns an empty string when there are no dates at all', () => {
    expect(dateRange('', '', false, fmt, 'Present')).toBe('');
  });

  it('renders a single side when only one date is known', () => {
    expect(dateRange('2020-01-01', '', false, fmt, 'Present')).toBe('[2020-01-01]');
    expect(dateRange('', '2022-01-01', false, fmt, 'Present')).toBe('[2022-01-01]');
  });
});
