import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit, clientIp, enforceRateLimit, resetRateLimits } from '@/lib/rate-limit';
import { resetEnvCache } from '@/lib/env';
import { ApiError } from '@/lib/errors';

const RULE = { limit: 3, windowMs: 1000 };

beforeEach(() => {
  resetRateLimits();
  resetEnvCache();
  process.env.NEXTAUTH_SECRET = 'test-secret-that-is-long-enough-1234';
  process.env.RATE_LIMIT_ENABLED = 'true';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkRateLimit', () => {
  it('allows exactly `limit` requests inside a window', () => {
    for (let i = 0; i < RULE.limit; i += 1) {
      expect(checkRateLimit('user-1', RULE).allowed).toBe(true);
    }
    expect(checkRateLimit('user-1', RULE).allowed).toBe(false);
  });

  it('counts each identifier separately', () => {
    for (let i = 0; i < RULE.limit; i += 1) checkRateLimit('user-1', RULE);
    expect(checkRateLimit('user-2', RULE).allowed).toBe(true);
  });

  it('reports the remaining budget', () => {
    expect(checkRateLimit('user-1', RULE).remaining).toBe(2);
    expect(checkRateLimit('user-1', RULE).remaining).toBe(1);
    expect(checkRateLimit('user-1', RULE).remaining).toBe(0);
  });

  it('starts a fresh window once the old one expires', () => {
    for (let i = 0; i < RULE.limit; i += 1) checkRateLimit('user-1', RULE);
    expect(checkRateLimit('user-1', RULE).allowed).toBe(false);

    vi.advanceTimersByTime(RULE.windowMs + 1);
    expect(checkRateLimit('user-1', RULE).allowed).toBe(true);
  });
});

describe('enforceRateLimit', () => {
  it('throws a 429 ApiError once the budget is gone', () => {
    // `auth` allows 10 per hour.
    for (let i = 0; i < 10; i += 1) enforceRateLimit('auth', '10.0.0.1');

    try {
      enforceRateLimit('auth', '10.0.0.1');
      throw new Error('expected enforceRateLimit to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(429);
      expect((error as ApiError).code).toBe('rate_limited');
    }
  });

  it('is a no-op when disabled through the environment', () => {
    process.env.RATE_LIMIT_ENABLED = 'false';
    resetEnvCache();
    for (let i = 0; i < 50; i += 1) {
      expect(() => enforceRateLimit('auth', '10.0.0.2')).not.toThrow();
    }
  });
});

describe('clientIp', () => {
  it('takes the first hop of x-forwarded-for', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.5, 70.41.3.18' },
    });
    expect(clientIp(request)).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip, then to a shared bucket', () => {
    expect(
      clientIp(new Request('https://example.com', { headers: { 'x-real-ip': '198.51.100.7' } }))
    ).toBe('198.51.100.7');
    expect(clientIp(new Request('https://example.com'))).toBe('unknown');
  });
});
