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
};

const entries =
  globalForRateLimit.voicePlaygroundRateLimits ?? new Map<string, RateLimitEntry>();

globalForRateLimit.voicePlaygroundRateLimits = entries;

export function checkRateLimit(
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

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
  };
}

export function resetRateLimitsForTests(): void {
  entries.clear();
}

function cleanExpiredEntries(now: number): void {
  if (entries.size < 1_000) return;

  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(key);
  }
}
