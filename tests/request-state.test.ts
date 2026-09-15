import { describe, expect, it } from "vitest";

import {
  assertTransition,
  canTransition,
} from "@/features/requests/domain/request-state";

describe("request state transitions", () => {
  it("allows NEW to become DRAFT_READY", () => {
    expect(canTransition("NEW", "DRAFT_READY")).toBe(true);
  });

  it("allows DRAFT_READY to become REVIEWED", () => {
    expect(canTransition("DRAFT_READY", "REVIEWED")).toBe(true);
  });

  it("does not allow NEW to become REVIEWED", () => {
    expect(canTransition("NEW", "REVIEWED")).toBe(false);

    expect(() => {
      assertTransition("NEW", "REVIEWED");
    }).toThrow();
  });

  it("does not allow REVIEWED to change state", () => {
    expect(canTransition("REVIEWED", "NEW")).toBe(false);
    expect(canTransition("REVIEWED", "DRAFT_READY")).toBe(false);
  });
});