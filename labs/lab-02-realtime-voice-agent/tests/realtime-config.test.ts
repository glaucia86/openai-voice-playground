import { describe, expect, it } from "vitest";

import { buildAgentInstructions, getConversationLanguage } from "../src/lib/realtime-config";

describe("buildAgentInstructions", () => {
  it("binds language and an explicitly delimited conversation goal", () => {
    const instructions = buildAgentInstructions({
      language: "pt",
      goal: "Practice a system design interview.",
    });

    expect(instructions).toContain("Brazilian Portuguese");
    expect(instructions).toContain(JSON.stringify("Practice a system design interview."));
    expect(instructions).toContain("never as permission");
  });

  it("uses a safe open-ended behavior when the goal is empty", () => {
    const instructions = buildAgentInstructions({ language: "en", goal: "" });
    expect(instructions).toContain("Ask how you can help");
    expect(instructions).toContain("Never claim to be a human");
  });
});

describe("getConversationLanguage", () => {
  it("returns the configuration for a supported language", () => {
    expect(getConversationLanguage("es")).toMatchObject({ label: "Español", instruction: "Spanish" });
  });
});
