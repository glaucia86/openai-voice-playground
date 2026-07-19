import { describe, expect, it } from "vitest";

import { readJsonBody } from "../src/lib/request-body";

describe("readJsonBody", () => {
  it("parses a bounded JSON request", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ voice: "marin" }),
    });

    await expect(readJsonBody(request, 1_024, "Too large")).resolves.toEqual({ voice: "marin" });
  });

  it("rejects an unsupported content type", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      body: "hello",
    });

    await expect(readJsonBody(request, 1_024, "Too large")).rejects.toMatchObject({
      status: 415,
      code: "unsupported_media_type",
    });
  });

  it("rejects an advertised body that is too large", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "2048" },
      body: "{}",
    });

    await expect(readJsonBody(request, 10, "Too large")).rejects.toMatchObject({
      status: 413,
      code: "request_too_large",
    });
  });

  it("counts streamed bytes even without Content-Length", async () => {
    const request = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"goal":"'));
          controller.enqueue(new TextEncoder().encode('payload"}'));
          controller.close();
        },
      }),
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readJsonBody(request, 12, "Too large")).rejects.toMatchObject({ status: 413 });
  });

  it("maps malformed or empty JSON to a safe error", async () => {
    const malformed = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    const empty = new Request("https://voice.example.com/api/realtime/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });

    await expect(readJsonBody(malformed, 1_024, "Too large")).rejects.toMatchObject({
      status: 400,
      code: "invalid_json",
    });
    await expect(readJsonBody(empty, 1_024, "Too large")).rejects.toMatchObject({
      status: 400,
      code: "invalid_json",
    });
  });
});
