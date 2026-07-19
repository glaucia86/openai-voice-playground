import { afterEach, describe, expect, it, vi } from "vitest";

import { logVoiceRequest } from "../src/lib/observability";

afterEach(() => vi.restoreAllMocks());

describe("logVoiceRequest", () => {
  const event = {
    event: "realtime.client_secret_created",
    requestId: "request-1",
    route: "realtime-token" as const,
    durationMs: 42,
    status: 200,
    model: "gpt-realtime-2.1",
  };

  it("writes structured informational metadata", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    logVoiceRequest("info", event);

    expect(info).toHaveBeenCalledOnce();
    const parsed = JSON.parse(String(info.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(parsed).toMatchObject(event);
    expect(parsed.timestamp).toEqual(expect.any(String));
  });

  it("writes failures to stderr", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logVoiceRequest("error", { ...event, event: "realtime.client_secret_failed", status: 500 });
    expect(error).toHaveBeenCalledOnce();
  });
});
