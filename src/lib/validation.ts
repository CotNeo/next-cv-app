import { z } from 'zod';
import { TEMPLATE_IDS } from '@/data/templates';
import { locales } from '@/i18n/settings';

/** Blank strings arrive constantly from HTML forms; treat them as "not provided". */
const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max).optional());

const requiredText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max);

/** Dates travel as `YYYY-MM-DD` from date inputs; Mongoose casts them. */
const optionalDate = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')
    .optional()
);

/**
 * URLs end up in `href` attributes on the rendered CV, so the scheme matters:
 * `z.string().url()` happily accepts `javascript:alert(1)`, which would be a
 * stored XSS vector on every public share link.
 */
const optionalUrl = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(500)
    .url('Must be a valid URL')
    .refine((value) => {
      try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Only http(s) URLs are allowed')
    .optional()
);

const optionalEmail = z.preprocess(
  blankToUndefined,
  z.string().trim().max(200).email('Must be a valid email').optional()
);

/**
 * Photos are stored inline on the CV document. Mongo's hard document ceiling is
 * 16 MB, and base64 inflates bytes by ~33%, so cap the encoded string well below
 * it — this matches the 2 MB file limit enforced in the upload form.
 */
const MAX_PHOTO_CHARS = 3_000_000;

const profilePhoto = z.preprocess(
  blankToUndefined,
  z
    .string()
    .max(MAX_PHOTO_CHARS, 'Profile photo is too large (max 2MB)')
    .refine(
      (value) => /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(value) || /^https?:\/\//.test(value),
      'Profile photo must be an image data URL or an http(s) URL'
    )
    .optional()
);

/** Drops blank entries that the multi-step form leaves behind. */
const compactArray = <T extends z.ZodTypeAny>(item: T, max: number) =>
  z.array(item).max(max).default([]);

const personalInfoSchema = z
  .object({
    name: optionalText(200),
    email: optionalEmail,
    phone: optionalText(50),
    location: optionalText(200),
    website: optionalUrl,
    linkedin: optionalUrl,
    profilePhoto,
  })
  .default({});

const workExperienceSchema = z.object({
  company: optionalText(200),
  position: optionalText(200),
  startDate: optionalDate,
  endDate: optionalDate,
  description: optionalText(5000),
  isCurrent: z.boolean().optional(),
});

const educationSchema = z.object({
  institution: optionalText(200),
  degree: optionalText(200),
  field: optionalText(200),
  startDate: optionalDate,
  endDate: optionalDate,
  isCurrent: z.boolean().optional(),
});

const languageSchema = z.object({
  language: optionalText(100),
  level: optionalText(100),
});

const certificationSchema = z.object({
  name: optionalText(200),
  issuer: optionalText(200),
  date: optionalDate,
  expiryDate: optionalDate,
  credentialId: optionalText(200),
  credentialUrl: optionalUrl,
});

const projectSchema = z.object({
  name: optionalText(200),
  description: optionalText(5000),
  technologies: compactArray(z.string().trim().max(100), 50),
  url: optionalUrl,
  startDate: optionalDate,
  endDate: optionalDate,
  isCurrent: z.boolean().optional(),
});

const referenceSchema = z.object({
  name: optionalText(200),
  position: optionalText(200),
  company: optionalText(200),
  email: optionalEmail,
  phone: optionalText(50),
});

/** Fields a CV document exposes for writing. Anything else is server-owned. */
export const cvContentSchema = z.object({
  title: requiredText(200, 'Title'),
  personalInfo: personalInfoSchema,
  summary: optionalText(5000),
  workExperience: compactArray(workExperienceSchema, 50),
  education: compactArray(educationSchema, 50),
  skills: z
    .array(z.string().trim().max(100))
    .max(200)
    .default([])
    .transform((skills) => skills.filter(Boolean)),
  languages: compactArray(languageSchema, 50),
  certifications: compactArray(certificationSchema, 50),
  projects: compactArray(projectSchema, 50),
  references: compactArray(referenceSchema, 50),
  templateId: z.enum(TEMPLATE_IDS).optional(),
  /** Language the rendered CV is written in, independent of the UI locale. */
  language: z.enum(locales).optional(),
});

export const cvCreateSchema = cvContentSchema;
export const cvUpdateSchema = cvContentSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided'
);

export type CVContentInput = z.infer<typeof cvContentSchema>;

export const registerSchema = z.object({
  name: requiredText(100, 'Name'),
  email: z.string().trim().toLowerCase().email('Must be a valid email').max(200),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(200, 'Password must be at most 200 characters')
    .refine((value) => /[a-zA-Z]/.test(value), 'Password must contain a letter')
    .refine((value) => /[0-9]/.test(value), 'Password must contain a number'),
});

export const coverLetterSchema = z.object({
  jobTitle: requiredText(200, 'Job title'),
  companyName: requiredText(200, 'Company name'),
  jobDescription: z.preprocess(blankToUndefined, z.string().trim().max(10_000).optional()),
  language: z.enum(locales).default('tr'),
});

export const cvActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('ats-review') }),
  z.object({ action: z.literal('improve') }),
  z.object({
    action: z.literal('translate'),
    data: z.object({ targetLanguage: z.enum(locales) }),
  }),
]);

/**
 * Fields the AI translate/improve flows are allowed to rewrite.
 *
 * The model echoes back the whole document, so without a whitelist a
 * hallucinated `isPublic: true` or a duplicated `shareToken` would be persisted
 * straight into Mongo.
 */
export const AI_WRITABLE_CV_FIELDS = [
  'personalInfo',
  'summary',
  'workExperience',
  'education',
  'skills',
  'languages',
  'certifications',
  'projects',
  'references',
] as const;

const aiCVOutputSchema = cvContentSchema
  .pick({
    personalInfo: true,
    summary: true,
    workExperience: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    projects: true,
    references: true,
  })
  .partial();

/**
 * Narrows a model response down to the writable subset. Unknown keys are
 * dropped rather than rejected, because a slightly chatty model should not fail
 * an otherwise usable translation.
 */
export function sanitizeAICVOutput(raw: unknown): Partial<CVContentInput> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('AI response was not a JSON object');
  }

  const picked: Record<string, unknown> = {};
  for (const field of AI_WRITABLE_CV_FIELDS) {
    if (field in raw) picked[field] = (raw as Record<string, unknown>)[field];
  }

  const parsed = aiCVOutputSchema.safeParse(picked);
  if (!parsed.success) {
    throw new Error(
      `AI response failed validation: ${parsed.error.issues
        .map((issue) => `${issue.path.join('.')} ${issue.message}`)
        .join('; ')}`
    );
  }

  // A model that returns only unusable fields should not silently wipe the CV.
  if (Object.keys(parsed.data).length === 0) {
    throw new Error('AI response contained no usable CV fields');
  }

  return parsed.data;
}

/** Strips markdown code fences that models add despite being told not to. */
export function parseJSONResponse(content: string): unknown {
  const trimmed = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  return JSON.parse(trimmed);
}
