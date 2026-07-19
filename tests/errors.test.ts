import OpenAI from "openai";
import { describe, expect, it } from "vitest";

import {
  AppError,
  errorResponse,
  normalizeError,
} from "../src/lib/errors";
import { speechRequestSchema } from "../src/lib/schemas";

describe("normalizeError", () => {
  it("preserves an application error", () => {
    const error = new AppError(418, "teapot", "Short and stout");
    expect(normalizeError(error)).toBe(error);
  });

  it("turns a Zod error into a safe bad request", () => {
    const parsed = speechRequestSchema.safeParse({ text: "", voice: "marin" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    expect(normalizeError(parsed.error)).toMatchObject({
      status: 400,
      code: "invalid_request",
    });
  });

  it("maps malformed JSON", () => {
    expect(normalizeError(new SyntaxError("private parser detail"))).toMatchObject({
      status: 400,
      code: "invalid_json",
      message: "The request body is not valid JSON.",
    });
  });

  it.each([
    [429, 429, "upstream_rate_limit"],
    [401, 503, "upstream_authentication_error"],
    [403, 503, "upstream_authentication_error"],
    [500, 502, "upstream_error"],
  ])("maps OpenAI status %i without exposing the provider message", (upstream, status, code) => {
    const providerError = new OpenAI.APIError(
      upstream,
      { error: { message: "sensitive provider detail" } },
      "sensitive provider detail",
      new Headers(),
    );

    expect(normalizeError(providerError)).toMatchObject({ status, code });
    expect(normalizeError(providerError).message).not.toContain("sensitive");
  });

  it("maps a cancelled request", () => {
    const error = new Error("cancelled");
    error.name = "AbortError";
    expect(normalizeError(error)).toMatchObject({ status: 499, code: "request_cancelled" });
  });

  it("uses a generic fallback for unknown failures", () => {
    expect(normalizeError({ unexpected: true })).toMatchObject({
      status: 500,
      code: "internal_error",
    });
  });
});

describe("errorResponse", () => {
  it("returns the stable no-store envelope and custom headers", async () => {
    const response = errorResponse(
      new AppError(400, "invalid", "Invalid input"),
      "request-123",
      { "RateLimit-Remaining": "9" },
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-request-id")).toBe("request-123");
    expect(response.headers.get("ratelimit-remaining")).toBe("9");
    await expect(response.json()).resolves.toEqual({
      error: { code: "invalid", message: "Invalid input", requestId: "request-123" },
    });
  });
});
