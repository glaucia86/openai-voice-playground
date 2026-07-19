import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { middleware } from "../src/middleware";

afterEach(() => vi.unstubAllEnvs());

describe("security middleware", () => {
  it("creates a strict nonce-based production CSP with Realtime origins", () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = middleware(new NextRequest("https://voice.example.com/"));
    const policy = response.headers.get("content-security-policy") ?? "";

    expect(policy).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
    expect(policy).not.toContain("'unsafe-inline'");
    expect(policy).toContain("https://api.openai.com wss://api.openai.com");
    expect(policy).toContain("upgrade-insecure-requests");
  });
});
