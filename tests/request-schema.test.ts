import { describe, expect, it } from "vitest";

import { createRequestSchema } from "@/features/requests/schemas/request-schema";

describe("createRequestSchema", () => {
  it("rejects a blank client name", () => {
    const result = createRequestSchema.safeParse({
      clientName: "   ",
      existingScope: "",
      clientMessage: "We need a website.",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a blank client message", () => {
    const result = createRequestSchema.safeParse({
      clientName: "Mira Tiles",
      existingScope: "",
      clientMessage: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid request", () => {
    const result = createRequestSchema.safeParse({
      clientName: "Mira Tiles",
      existingScope: "",
      clientMessage: "We need a new website.",
    });

    expect(result.success).toBe(true);
  });
});