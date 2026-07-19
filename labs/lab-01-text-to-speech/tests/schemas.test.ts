import { describe, expect, it } from "vitest";

import { speechRequestSchema } from "../src/lib/schemas";

describe("speechRequestSchema", () => {
  it("applies safe defaults to a minimal request", () => {
    const result = speechRequestSchema.parse({ text: "Hello", voice: "marin" });

    expect(result).toEqual({
      text: "Hello",
      voice: "marin",
      format: "mp3",
      instructions: "",
      speed: 1,
    });
  });

  it("trims text and accepts supported controls", () => {
    const result = speechRequestSchema.parse({
      text: "  A clear explanation.  ",
      voice: "cedar",
      format: "wav",
      instructions: "  Speak calmly.  ",
      speed: "1.25",
    });

    expect(result.text).toBe("A clear explanation.");
    expect(result.instructions).toBe("Speak calmly.");
    expect(result.speed).toBe(1.25);
  });

  it("rejects unsupported voices and extra fields", () => {
    expect(() => speechRequestSchema.parse({ text: "Hello", voice: "celebrity" })).toThrow();
    expect(() =>
      speechRequestSchema.parse({ text: "Hello", voice: "marin", apiKey: "never" }),
    ).toThrow();
  });

  it("enforces the upstream text and speed limits", () => {
    expect(() => speechRequestSchema.parse({ text: "x".repeat(4_097), voice: "marin" })).toThrow();
    expect(() => speechRequestSchema.parse({ text: "Hello", voice: "marin", speed: 4.1 })).toThrow();
  });
});
