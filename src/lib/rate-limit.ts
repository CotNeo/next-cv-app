import { ApiError } from '@/lib/errors';
import { getEnv } from '@/lib/env';

/**
 * Fixed-window rate limiter backed by process memory.
 *
 * This protects a single server instance. On multi-instance deployments each
 * instance keeps its own counters, so the effective limit is `limit x instances`
 * — enough to stop runaway loops and casual abuse, but swap the store for Redis
 * (or Vercel KV) if you need a global guarantee.
 */
interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
let lastSweep = 0;

/** Drop expired windows occasionally so the map cannot grow without bound. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitRule {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export const RATE_LIMITS = {
  /** Registration and other credential endpoints. */
  auth: { limit: 10, windowMs: 60 * 60 * 1000 },
  /** OpenAI-backed endpoints: the expensive ones. */
  ai: { limit: 20, windowMs: 60 * 60 * 1000 },
  /** Ordinary authenticated writes. */
  write: { limit: 60, windowMs: 60 * 1000 },
  /** Unauthenticated reads such as public CV pages. */
  publicRead: { limit: 120, windowMs: 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    const window = { count: 1, resetAt: now + rule.windowMs };
    windows.set(key, window);
    return { allowed: true, remaining: rule.limit - 1, resetAt: window.resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= rule.limit,
    remaining: Math.max(0, rule.limit - existing.count),
    resetAt: existing.resetAt,
  };
}

/** Best-effort client identity: the proxy-forwarded IP, else a shared bucket. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Throws a 429 ApiError when `identifier` has exhausted `rule` for `scope`.
 * Prefer a stable identifier (user id) over the IP where one is available.
 */
export function enforceRateLimit(
  scope: keyof typeof RATE_LIMITS,
  identifier: string
): void {
  if (!getEnv().RATE_LIMIT_ENABLED) return;

  const rule = RATE_LIMITS[scope];
  const result = checkRateLimit(`${scope}:${identifier}`, rule);
  if (result.allowed) return;

  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  throw new ApiError(
    429,
    `Too many requests. Try again in ${retryAfter} seconds.`,
    'rate_limited'
  );
}

/** Only for tests. */
export function resetRateLimits(): void {
  windows.clear();
  lastSweep = 0;
}
