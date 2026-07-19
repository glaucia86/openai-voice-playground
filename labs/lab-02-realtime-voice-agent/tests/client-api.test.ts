import { describe, expect, it } from "vitest";

import {
  authorizationHeaders,
  readApiError,
} from "../src/lib/client-api";

describe("client API helpers", () => {
  it("only adds authorization when a token exists", () => {
    expect(authorizationHeaders("  ")).toEqual({});
    expect(authorizationHeaders(" token ")).toEqual({ Authorization: "Bearer token" });
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
