import { z } from 'zod';

/** Treat empty/whitespace-only env vars as unset, which is how most hosts send them. */
const optionalString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional()
);

const booleanish = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', ''].includes(normalized)) return false;
  return value;
}, z.boolean());

const DEV_MONGODB_URI = 'mongodb://localhost:27017/cv-builder';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '0.0.0.0']);

/**
 * Cookies must not travel over plain http in production — except against a
 * loopback host, which is how you smoke-test a production build locally
 * (`npm run build && npm start`).
 */
function isSecureOrLoopback(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return true;
    return parsed.protocol === 'http:' && LOOPBACK_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    MONGODB_URI: z.string().trim().min(1).default(DEV_MONGODB_URI),

    NEXTAUTH_SECRET: z.string().trim().min(1, 'NEXTAUTH_SECRET is required'),
    NEXTAUTH_URL: optionalString,

    OPENAI_API_KEY: optionalString,
    OPENAI_MODEL: z.string().trim().min(1).default('gpt-4o-mini'),

    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,

    /** CVs a new account may create before it needs an upgrade. */
    FREE_CV_LIMIT: z.coerce.number().int().min(1).default(3),

    RATE_LIMIT_ENABLED: booleanish.default(true),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;

    if (env.NEXTAUTH_SECRET.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_SECRET'],
        message: 'must be at least 32 characters in production (openssl rand -base64 32)',
      });
    }
    if (!env.NEXTAUTH_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_URL'],
        message: 'is required in production (e.g. https://cv.example.com)',
      });
    } else if (!isSecureOrLoopback(env.NEXTAUTH_URL)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NEXTAUTH_URL'],
        message: 'must use https:// in production (http:// is allowed for localhost only)',
      });
    }
    if (env.MONGODB_URI === DEV_MONGODB_URI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MONGODB_URI'],
        message: 'is required in production (the localhost default is development-only)',
      });
    }
    if (Boolean(env.GOOGLE_CLIENT_ID) !== Boolean(env.GOOGLE_CLIENT_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GOOGLE_CLIENT_ID'],
        message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together',
      });
    }
  });

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

/**
 * Parsed, validated server environment. Resolved lazily so that `next build`
 * (which has no runtime secrets) never trips over a missing variable — startup
 * validation happens in `src/instrumentation.ts` instead.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  cached = parsed.data;
  return cached;
}

/** Throws with every problem listed at once. Called on server startup. */
export function validateEnv(): void {
  getEnv();
}

export function isAIEnabled(): boolean {
  return Boolean(getEnv().OPENAI_API_KEY);
}

export function isGoogleOAuthEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/** Only for tests, which mutate process.env between cases. */
export function resetEnvCache(): void {
  cached = null;
}
