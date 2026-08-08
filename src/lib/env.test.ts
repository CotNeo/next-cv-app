import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getEnv, isGoogleOAuthEnabled, resetEnvCache } from '@/lib/env';

const SNAPSHOT = { ...process.env };

const PROD_BASE = {
  NODE_ENV: 'production',
  NEXTAUTH_SECRET: 'a'.repeat(32),
  NEXTAUTH_URL: 'https://cv.example.com',
  MONGODB_URI: 'mongodb+srv://user:pass@cluster.mongodb.net/cv',
};

function setEnv(values: Record<string, string | undefined>) {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('NEXTAUTH') || key.startsWith('GOOGLE') || key.startsWith('MONGODB')) {
      delete process.env[key];
    }
  }
  delete process.env.FREE_CV_LIMIT;
  delete process.env.OPENAI_API_KEY;
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  resetEnvCache();
}

beforeEach(() => resetEnvCache());

afterEach(() => {
  process.env = { ...SNAPSHOT };
  resetEnvCache();
});

describe('getEnv in development', () => {
  it('falls back to a local database and a low CV limit default', () => {
    setEnv({ NODE_ENV: 'development', NEXTAUTH_SECRET: 'dev-secret' });
    const env = getEnv();
    expect(env.MONGODB_URI).toContain('localhost');
    expect(env.FREE_CV_LIMIT).toBe(3);
    expect(env.OPENAI_MODEL).toBe('gpt-4o-mini');
    expect(env.RATE_LIMIT_ENABLED).toBe(true);
  });

  it('treats an empty optional variable as unset', () => {
    setEnv({ NODE_ENV: 'development', NEXTAUTH_SECRET: 'dev-secret', OPENAI_API_KEY: '   ' });
    expect(getEnv().OPENAI_API_KEY).toBeUndefined();
  });

  it('coerces FREE_CV_LIMIT from its string form', () => {
    setEnv({ NODE_ENV: 'development', NEXTAUTH_SECRET: 'dev-secret', FREE_CV_LIMIT: '10' });
    expect(getEnv().FREE_CV_LIMIT).toBe(10);
  });
});

describe('getEnv in production', () => {
  it('accepts a fully configured environment', () => {
    setEnv(PROD_BASE);
    expect(getEnv().NEXTAUTH_URL).toBe('https://cv.example.com');
  });

  it('rejects a short secret', () => {
    setEnv({ ...PROD_BASE, NEXTAUTH_SECRET: 'too-short' });
    expect(() => getEnv()).toThrow(/NEXTAUTH_SECRET/);
  });

  it('rejects a public http NEXTAUTH_URL', () => {
    setEnv({ ...PROD_BASE, NEXTAUTH_URL: 'http://cv.example.com' });
    expect(() => getEnv()).toThrow(/https/);
  });

  it.each(['http://localhost:3000', 'http://127.0.0.1:3000'])(
    'allows %s so a production build can be smoke-tested locally',
    (url) => {
      setEnv({ ...PROD_BASE, NEXTAUTH_URL: url });
      expect(getEnv().NEXTAUTH_URL).toBe(url);
    }
  );

  it('rejects a malformed NEXTAUTH_URL', () => {
    setEnv({ ...PROD_BASE, NEXTAUTH_URL: 'not a url' });
    expect(() => getEnv()).toThrow(/NEXTAUTH_URL/);
  });

  it('rejects the localhost database default', () => {
    setEnv({ ...PROD_BASE, MONGODB_URI: undefined });
    expect(() => getEnv()).toThrow(/MONGODB_URI/);
  });

  it('rejects a half-configured Google OAuth pair', () => {
    setEnv({ ...PROD_BASE, GOOGLE_CLIENT_ID: 'id-only' });
    expect(() => getEnv()).toThrow(/GOOGLE_CLIENT_SECRET/);
  });

  it('reports every problem at once', () => {
    setEnv({ NODE_ENV: 'production', NEXTAUTH_SECRET: 'short' });
    try {
      getEnv();
      throw new Error('expected getEnv to throw');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('NEXTAUTH_SECRET');
      expect(message).toContain('NEXTAUTH_URL');
      expect(message).toContain('MONGODB_URI');
    }
  });
});

describe('isGoogleOAuthEnabled', () => {
  it('is true only when both halves are present', () => {
    setEnv({ NODE_ENV: 'development', NEXTAUTH_SECRET: 'dev-secret' });
    expect(isGoogleOAuthEnabled()).toBe(false);

    process.env.GOOGLE_CLIENT_ID = 'id';
    expect(isGoogleOAuthEnabled()).toBe(false);

    process.env.GOOGLE_CLIENT_SECRET = 'secret';
    expect(isGoogleOAuthEnabled()).toBe(true);
  });
});
