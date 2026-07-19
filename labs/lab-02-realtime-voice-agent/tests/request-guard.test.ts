import { afterEach, describe, expect, it, vi } from "vitest";

import { resetRateLimitsForTests } from "../src/lib/rate-limit";
import { guardApiRequest } from "../src/lib/request-guard";

afterEach(() => {
  vi.unstubAllEnvs();
  delete process.env.PLAYGROUND_ACCESS_TOKEN;
  delete process.env.APP_ORIGIN;
  delete process.env.CLIENT_IP_HEADER;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetRateLimitsForTests();
});

describe("guardApiRequest", () => {
  it("accepts a same-origin request and returns a quota", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      headers: { origin: "https://voice.example.com", "x-forwarded-for": "203.0.113.10" },
    });

    await expect(guardApiRequest(request, "realtime-token")).resolves.toMatchObject({
      allowed: true,
      remaining: 9,
    });
  });

  it("fails closed when production safeguards are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await expect(
      guardApiRequest(
        new Request("https://voice.example.com/api/realtime/token"),
        "realtime-token",
      ),
    ).rejects.toMatchObject({
      status: 503,
      code: "security_configuration_incomplete",
    });
  });

  it("blocks explicit cross-site browser requests", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
    });

    await expect(guardApiRequest(request, "realtime-token")).rejects.toMatchObject({
      status: 403,
      code: "cross_origin_request",
    });
  });

  it("requires the configured deployment access token", async () => {
    process.env.PLAYGROUND_ACCESS_TOKEN = "a-long-shared-token";

    const unauthorized = new Request("https://voice.example.com/api/realtime/token");
    await expect(guardApiRequest(unauthorized, "realtime-token")).rejects.toMatchObject({
      status: 401,
      code: "unauthorized",
    });

    const authorized = new Request("https://voice.example.com/api/realtime/token", {
      headers: { authorization: "Bearer a-long-shared-token" },
    });
    await expect(guardApiRequest(authorized, "realtime-token")).resolves.toMatchObject({
      allowed: true,
    });
  });

  it("rate-limits invalid token attempts before authentication", async () => {
    process.env.PLAYGROUND_ACCESS_TOKEN = "a-long-shared-token";
    const request = () =>
      new Request("https://voice.example.com/api/realtime/token", {
        headers: { authorization: "Bearer wrong", "x-forwarded-for": "203.0.113.20" },
      });

    for (let index = 0; index < 30; index += 1) {
      await expect(guardApiRequest(request(), "realtime-token")).rejects.toMatchObject({
        status: 401,
      });
    }
    await expect(guardApiRequest(request(), "realtime-token")).rejects.toMatchObject({
      status: 429,
      code: "rate_limit_exceeded",
      headers: expect.objectContaining({ "Retry-After": expect.any(String) }),
    });
  });

  it("honors a configured canonical origin", async () => {
    process.env.APP_ORIGIN = "https://voice.example.com";
    const request = new Request("https://preview.example.com/api/realtime/token", {
      headers: { origin: "https://preview.example.com" },
    });

    await expect(guardApiRequest(request, "realtime-token")).rejects.toMatchObject({ status: 403 });
  });

  it("rejects an invalid origin header", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      headers: { origin: "not a URL" },
    });
    await expect(guardApiRequest(request, "realtime-token")).rejects.toMatchObject({
      status: 403,
      code: "invalid_origin",
    });
  });

  it("enforces the local operation quota", async () => {
    for (let index = 0; index < 10; index += 1) {
      await guardApiRequest(
        new Request("https://voice.example.com/api/realtime/token"),
        "realtime-token",
      );
    }

    await expect(
      guardApiRequest(
        new Request("https://voice.example.com/api/realtime/token"),
        "realtime-token",
      ),
    ).rejects.toMatchObject({ status: 429, code: "rate_limit_exceeded" });
  });
});
