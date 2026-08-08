import { describe, expect, it } from 'vitest';
import {
  coverLetterSchema,
  cvActionSchema,
  cvContentSchema,
  parseJSONResponse,
  registerSchema,
  sanitizeAICVOutput,
} from '@/lib/validation';

const minimalCV = { title: 'My CV' };

describe('cvContentSchema', () => {
  it('fills every collection with a default so the model never sees undefined', () => {
    const parsed = cvContentSchema.parse(minimalCV);
    expect(parsed.workExperience).toEqual([]);
    expect(parsed.skills).toEqual([]);
    expect(parsed.references).toEqual([]);
  });

  it('rejects a blank title', () => {
    expect(() => cvContentSchema.parse({ title: '   ' })).toThrow();
  });

  it('treats blank form fields as absent instead of storing empty strings', () => {
    const parsed = cvContentSchema.parse({
      ...minimalCV,
      personalInfo: { name: 'Ada', email: '', website: '' },
    });
    expect(parsed.personalInfo.email).toBeUndefined();
    expect(parsed.personalInfo.website).toBeUndefined();
    expect(parsed.personalInfo.name).toBe('Ada');
  });

  it('drops blank skills left behind by the multi-step form', () => {
    const parsed = cvContentSchema.parse({ ...minimalCV, skills: ['React', '', '  ', 'Go'] });
    expect(parsed.skills).toEqual(['React', 'Go']);
  });

  it('rejects an invalid email and an invalid URL', () => {
    expect(() =>
      cvContentSchema.parse({ ...minimalCV, personalInfo: { email: 'not-an-email' } })
    ).toThrow();
    expect(() =>
      cvContentSchema.parse({ ...minimalCV, personalInfo: { website: 'javascript:alert(1)' } })
    ).toThrow();
  });

  it('rejects an unknown template id', () => {
    expect(() => cvContentSchema.parse({ ...minimalCV, templateId: 'hacker' })).toThrow();
  });

  it('rejects a profile photo that is neither a data URL nor http(s)', () => {
    expect(() =>
      cvContentSchema.parse({
        ...minimalCV,
        personalInfo: { profilePhoto: 'javascript:alert(1)' },
      })
    ).toThrow();
  });

  it('accepts a base64 image data URL', () => {
    const parsed = cvContentSchema.parse({
      ...minimalCV,
      personalInfo: { profilePhoto: 'data:image/png;base64,iVBORw0KGgo=' },
    });
    expect(parsed.personalInfo.profilePhoto).toContain('data:image/png');
  });

  it('rejects a photo larger than the 2MB upload limit', () => {
    const oversized = `data:image/png;base64,${'A'.repeat(3_000_001)}`;
    expect(() =>
      cvContentSchema.parse({ ...minimalCV, personalInfo: { profilePhoto: oversized } })
    ).toThrow();
  });
});

describe('registerSchema', () => {
  it('normalises the email to lowercase', () => {
    const parsed = registerSchema.parse({
      name: 'Ada',
      email: '  Ada@Example.COM ',
      password: 'hunter2secret',
    });
    expect(parsed.email).toBe('ada@example.com');
  });

  it.each([
    ['too short', 'ab1'],
    ['no digits', 'onlyletters'],
    ['no letters', '12345678'],
  ])('rejects a password that is %s', (_label, password) => {
    expect(() => registerSchema.parse({ name: 'Ada', email: 'a@b.com', password })).toThrow();
  });
});

describe('cvActionSchema', () => {
  it('requires a target language for translate', () => {
    expect(() => cvActionSchema.parse({ action: 'translate' })).toThrow();
    expect(() =>
      cvActionSchema.parse({ action: 'translate', data: { targetLanguage: 'klingon' } })
    ).toThrow();
    expect(
      cvActionSchema.parse({ action: 'translate', data: { targetLanguage: 'de' } })
    ).toEqual({ action: 'translate', data: { targetLanguage: 'de' } });
  });

  it('rejects an unknown action', () => {
    expect(() => cvActionSchema.parse({ action: 'drop-database' })).toThrow();
  });
});

describe('coverLetterSchema', () => {
  it('defaults the language and requires the job details', () => {
    const parsed = coverLetterSchema.parse({ jobTitle: 'Dev', companyName: 'Acme' });
    expect(parsed.language).toBe('tr');
    expect(() => coverLetterSchema.parse({ jobTitle: '', companyName: 'Acme' })).toThrow();
  });
});

describe('parseJSONResponse', () => {
  it('strips the markdown fences models add despite instructions', () => {
    expect(parseJSONResponse('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJSONResponse('```\n{"a":2}\n```')).toEqual({ a: 2 });
    expect(parseJSONResponse('  {"a":3}  ')).toEqual({ a: 3 });
  });
});

describe('sanitizeAICVOutput', () => {
  it('keeps only the writable content fields', () => {
    const result = sanitizeAICVOutput({
      summary: 'Rewritten summary',
      skills: ['Go'],
      _id: 'deadbeef',
      userId: 'someone-else',
      shareToken: 'stolen-token',
      isPublic: true,
      atsScore: 100,
      templateId: 'modern',
    });

    expect(result).toEqual({ summary: 'Rewritten summary', skills: ['Go'] });
    expect(result).not.toHaveProperty('shareToken');
    expect(result).not.toHaveProperty('isPublic');
    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('atsScore');
  });

  it('refuses a response that would wipe the CV', () => {
    expect(() => sanitizeAICVOutput({ isPublic: true })).toThrow(/no usable CV fields/);
  });

  it('refuses a non-object response', () => {
    expect(() => sanitizeAICVOutput(['summary'])).toThrow(/not a JSON object/);
    expect(() => sanitizeAICVOutput('summary')).toThrow(/not a JSON object/);
  });

  it('refuses structurally broken content rather than persisting it', () => {
    expect(() => sanitizeAICVOutput({ workExperience: 'a string, not a list' })).toThrow(
      /failed validation/
    );
  });
});
