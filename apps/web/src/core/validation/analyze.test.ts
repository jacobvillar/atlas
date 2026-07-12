import { describe, it, expect } from "vitest";
import { analyzeInputSchema } from "./analyze";

const base = {
  resumeText: "Experienced retail associate with five years of customer-facing work and team leadership.",
  jobDescriptionText: "We are hiring a customer success manager to onboard and retain enterprise accounts.",
};

describe("analyzeInputSchema", () => {
  it("accepts valid input with optional fields", () => {
    const result = analyzeInputSchema.safeParse({
      ...base,
      targetRole: "Customer Success Manager",
      resumeDocumentId: "11111111-1111-4111-8111-111111111111",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a too-short resume", () => {
    const result = analyzeInputSchema.safeParse({ ...base, resumeText: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid resumeDocumentId", () => {
    const result = analyzeInputSchema.safeParse({ ...base, resumeDocumentId: "not-a-uuid" });
    expect(result.success).toBe(false);
  });
});
