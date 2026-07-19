import { describe, expect, it } from "vitest";

import { getSecurityConfiguration } from "../src/lib/security-config";

describe("getSecurityConfiguration", () => {
  it("keeps the workshop usable without infrastructure in development", () => {
    expect(getSecurityConfiguration({ NODE_ENV: "development" })).toMatchObject({
      ready: true,
      requiresAccessToken: false,
      distributedRateLimit: false,
      clientIpHeader: "x-forwarded-for",
    });
  });

  it("fails closed when production safeguards are absent", () => {
    expect(getSecurityConfiguration({ NODE_ENV: "production" })).toMatchObject({
      ready: false,
      requiresAccessToken: true,
      missingVariables: [
        "PLAYGROUND_ACCESS_TOKEN",
        "APP_ORIGIN",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
        "CLIENT_IP_HEADER",
      ],
    });
  });

  it("accepts a complete Vercel production configuration", () => {
    expect(
      getSecurityConfiguration({
        NODE_ENV: "production",
        VERCEL: "1",
        PLAYGROUND_ACCESS_TOKEN: "secret",
        APP_ORIGIN: "https://voice.example.com",
        UPSTASH_REDIS_REST_URL: "https://redis.example.com",
        UPSTASH_REDIS_REST_TOKEN: "redis-secret",
      }),
    ).toMatchObject({
      ready: true,
      distributedRateLimit: true,
      clientIpHeader: "x-vercel-forwarded-for",
    });
  });

  it("rejects a sensitive header as the client identity source", () => {
    const configuration = getSecurityConfiguration({
      NODE_ENV: "production",
      PLAYGROUND_ACCESS_TOKEN: "secret",
      APP_ORIGIN: "https://voice.example.com",
      UPSTASH_REDIS_REST_URL: "https://redis.example.com",
      UPSTASH_REDIS_REST_TOKEN: "redis-secret",
      CLIENT_IP_HEADER: "authorization",
    });

    expect(configuration.ready).toBe(false);
    expect(configuration.missingVariables).toContain("CLIENT_IP_HEADER");
  });
});
