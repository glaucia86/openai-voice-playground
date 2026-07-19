import { afterEach, describe, expect, it } from "vitest";

import {
  checkRateLimit,
  rateLimitHeaders,
  resetRateLimitsForTests,
} from "../src/lib/rate-limit";

afterEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetRateLimitsForTests();
});

describe("checkRateLimit", () => {
  it("allows requests inside the fixed window", async () => {
    const first = await checkRateLimit("speech:client", { limit: 2, windowMs: 1_000, now: 100 });
    const second = await checkRateLimit("speech:client", { limit: 2, windowMs: 1_000, now: 200 });

    expect(first).toMatchObject({ allowed: true, remaining: 1, resetAt: 1_100 });
    expect(second).toMatchObject({ allowed: true, remaining: 0, resetAt: 1_100 });
  });

  it("blocks a request after the limit", async () => {
    await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 100 });
    const blocked = await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 200 });

    expect(blocked).toEqual({ allowed: false, limit: 1, remaining: 0, resetAt: 1_100 });
    expect(rateLimitHeaders(blocked)).toMatchObject({ "Retry-After": "1" });
  });

  it("opens a fresh window after reset", async () => {
    await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 100 });
    const nextWindow = await checkRateLimit("speech:client", {
      limit: 1,
      windowMs: 1_000,
      now: 1_101,
    });

    expect(nextWindow).toMatchObject({ allowed: true, remaining: 0, resetAt: 2_101 });
  });

  it("serializes standard rate-limit headers", () => {
    expect(
      rateLimitHeaders({ allowed: true, limit: 10, remaining: 9, resetAt: 12_345 }),
    ).toEqual({
      "RateLimit-Limit": "10",
      "RateLimit-Remaining": "9",
      "RateLimit-Reset": "13",
    });
  });

  it("periodically removes expired keys", async () => {
    for (let index = 0; index < 1_000; index += 1) {
      await checkRateLimit(`expired:${index}`, { limit: 1, windowMs: 1, now: 0 });
    }

    const result = await checkRateLimit("fresh", { limit: 1, windowMs: 1_000, now: 2 });
    expect(result.allowed).toBe(true);
  });
});
