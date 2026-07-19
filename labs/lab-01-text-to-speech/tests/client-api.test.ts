import { describe, expect, it } from "vitest";

import {
  authorizationHeaders,
  formatBytes,
  readApiError,
} from "../src/lib/client-api";

describe("client API helpers", () => {
  it("only adds authorization when a token exists", () => {
    expect(authorizationHeaders("  ")).toEqual({});
    expect(authorizationHeaders(" token ")).toEqual({ Authorization: "Bearer token" });
  });

  it("formats byte counts for the UI", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2_048)).toBe("2.0 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
  });

  it("parses the stable API error envelope", async () => {
    const response = Response.json(
      { error: { message: "Try again", code: "busy", requestId: "request-1" } },
      { status: 429 },
    );

    await expect(readApiError(response)).resolves.toEqual({
      message: "Try again",
      code: "busy",
      requestId: "request-1",
    });
  });

  it("falls back when an upstream body is not JSON", async () => {
    const response = new Response("gateway error", { status: 502 });
    await expect(readApiError(response)).resolves.toEqual({
      message: "The request could not be completed.",
    });
  });

  it("uses a stable message when a JSON error omits optional fields", async () => {
    const response = Response.json({ error: {} }, { status: 500 });
    await expect(readApiError(response)).resolves.toEqual({
      message: "The request could not be completed.",
    });
  });
});
