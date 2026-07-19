import { afterEach, describe, expect, it } from "vitest";

import { AppError } from "../src/lib/errors";
import { resetRateLimitsForTests } from "../src/lib/rate-limit";
import { guardApiRequest } from "../src/lib/request-guard";

afterEach(() => {
  delete process.env.PLAYGROUND_ACCESS_TOKEN;
  delete process.env.APP_ORIGIN;
  resetRateLimitsForTests();
});

describe("guardApiRequest", () => {
  it("accepts a same-origin request and returns a quota", () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "https://voice.example.com", "x-forwarded-for": "203.0.113.10" },
    });

    expect(guardApiRequest(request, "speech")).toMatchObject({ allowed: true, remaining: 9 });
  });

  it("blocks explicit cross-site browser requests", () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
    });

    expect(() => guardApiRequest(request, "speech")).toThrowError(AppError);
    try {
      guardApiRequest(request, "speech");
    } catch (error) {
      expect(error).toMatchObject({ status: 403, code: "cross_origin_request" });
    }
  });

  it("requires the optional deployment access token", () => {
    process.env.PLAYGROUND_ACCESS_TOKEN = "a-long-shared-token";

    const unauthorized = new Request("https://voice.example.com/api/speech");
    expect(() => guardApiRequest(unauthorized, "speech")).toThrow();

    const authorized = new Request("https://voice.example.com/api/speech", {
      headers: { authorization: "Bearer a-long-shared-token" },
    });
    expect(guardApiRequest(authorized, "speech").allowed).toBe(true);
  });

  it("honors a configured canonical origin", () => {
    process.env.APP_ORIGIN = "https://voice.example.com";
    const request = new Request("https://preview.example.com/api/speech", {
      headers: { origin: "https://preview.example.com" },
    });

    expect(() => guardApiRequest(request, "speech")).toThrow();
  });

  it("rejects an invalid origin header", () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "not a URL" },
    });
    expect(() => guardApiRequest(request, "speech")).toThrowError(
      expect.objectContaining({ status: 403, code: "invalid_origin" }),
    );
  });

  it("enforces the local quota", () => {
    for (let index = 0; index < 10; index += 1) {
      guardApiRequest(new Request("https://voice.example.com/api/speech"), "speech");
    }

    expect(() =>
      guardApiRequest(new Request("https://voice.example.com/api/speech"), "speech"),
    ).toThrowError(expect.objectContaining({ status: 429, code: "rate_limit_exceeded" }));
  });
});
