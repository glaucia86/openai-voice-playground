import { describe, expect, it } from "vitest";

import {
  getElapsedSessionSeconds,
  hasReachedSessionLimit,
} from "../src/lib/session-lifetime";

describe("session lifetime", () => {
  it("calculates non-negative whole seconds", () => {
    expect(getElapsedSessionSeconds(1_000, 3_999)).toBe(2);
    expect(getElapsedSessionSeconds(5_000, 1_000)).toBe(0);
  });

  it("ends the workshop at 15 minutes", () => {
    expect(hasReachedSessionLimit(899)).toBe(false);
    expect(hasReachedSessionLimit(900)).toBe(true);
  });
});
