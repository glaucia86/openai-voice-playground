import { describe, expect, it } from "vitest";

import { realtimeSessionRequestSchema } from "../src/lib/schemas";

describe("realtimeSessionRequestSchema", () => {
  it("applies safe defaults to a minimal session request", () => {
    expect(realtimeSessionRequestSchema.parse({})).toEqual({
      voice: "marin",
      language: "pt",
      microphoneProfile: "near_field",
      goal: "",
    });
  });

  it("trims and accepts enumerated session controls", () => {
    const result = realtimeSessionRequestSchema.parse({
      voice: "cedar",
      language: "en",
      microphoneProfile: "far_field",
      goal: "  Rehearse an architecture interview.  ",
    });

    expect(result.goal).toBe("Rehearse an architecture interview.");
    expect(result.voice).toBe("cedar");
    expect(result.microphoneProfile).toBe("far_field");
  });

  it("rejects arbitrary models, voices, and extra credentials", () => {
    expect(() => realtimeSessionRequestSchema.parse({ voice: "celebrity" })).toThrow();
    expect(() => realtimeSessionRequestSchema.parse({ model: "expensive-model" })).toThrow();
    expect(() => realtimeSessionRequestSchema.parse({ apiKey: "never" })).toThrow();
  });

  it("enforces the conversation goal contract", () => {
    expect(() => realtimeSessionRequestSchema.parse({ goal: "x".repeat(601) })).toThrow();
  });
});
