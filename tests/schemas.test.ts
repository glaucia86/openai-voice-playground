import { describe, expect, it } from "vitest";

import { speechRequestSchema, transcriptionFieldsSchema } from "../src/lib/schemas";

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

describe("transcriptionFieldsSchema", () => {
  it("uses the mini model and automatic language by default", () => {
    expect(transcriptionFieldsSchema.parse({})).toEqual({
      model: "gpt-4o-mini-transcribe",
      language: "",
      prompt: "",
    });
  });

  it("normalizes valid ISO-639-1 language codes", () => {
    expect(transcriptionFieldsSchema.parse({ language: " PT " }).language).toBe("pt");
  });

  it("rejects invalid language codes", () => {
    expect(() => transcriptionFieldsSchema.parse({ language: "pt-BR" })).toThrow();
  });
});
