import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: number;
};

const globalForRateLimit = globalThis as unknown as {
  voicePlaygroundRateLimits?: Map<string, RateLimitEntry>;
  voicePlaygroundDistributedLimiters?: Map<string, Ratelimit>;
};

const entries =
  globalForRateLimit.voicePlaygroundRateLimits ?? new Map<string, RateLimitEntry>();
const distributedLimiters =
  globalForRateLimit.voicePlaygroundDistributedLimiters ?? new Map<string, Ratelimit>();

globalForRateLimit.voicePlaygroundRateLimits = entries;
globalForRateLimit.voicePlaygroundDistributedLimiters = distributedLimiters;

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (redisUrl && redisToken) {
    const limiter = getDistributedLimiter(redisUrl, redisToken, options);
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return checkLocalRateLimit(key, options);
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
    ...(!result.allowed
      ? { "Retry-After": String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1_000))) }
      : {}),
  };
}

export function resetRateLimitsForTests(): void {
  entries.clear();
  distributedLimiters.clear();
}

function checkLocalRateLimit(
  key: string,
  { limit, windowMs, now = Date.now() }: RateLimitOptions,
): RateLimitResult {
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    entries.set(key, { count: 1, resetAt });
    cleanExpiredEntries(now);
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}

function getDistributedLimiter(
  url: string,
  token: string,
  { limit, windowMs }: RateLimitOptions,
): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  const existing = distributedLimiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.fixedWindow(limit, `${windowMs} ms` as Duration),
    analytics: false,
    prefix: "openai-voice-playground:lab-02",
  });
  distributedLimiters.set(cacheKey, limiter);
  return limiter;
}

function cleanExpiredEntries(now: number): void {
  if (entries.size < 1_000) return;

  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(key);
  }
}
