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

  // ATLAS-006A: existing callers send no mode field and must behave exactly as
  // before — mode defaults to "job_description".
  it("defaults mode to job_description when omitted", () => {
    const result = analyzeInputSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mode).toBe("job_description");
    }
  });

  it("rejects a missing job description in default (job_description) mode", () => {
    const result = analyzeInputSchema.safeParse({ resumeText: base.resumeText });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short job description in job_description mode", () => {
    const result = analyzeInputSchema.safeParse({
      ...base,
      mode: "job_description",
      jobDescriptionText: "too short",
    });
    expect(result.success).toBe(false);
  });

  describe("career_path mode", () => {
    const careerBase = {
      resumeText: base.resumeText,
      mode: "career_path" as const,
    };

    it("accepts a resume plus a target role with no job description", () => {
      const result = analyzeInputSchema.safeParse({
        ...careerBase,
        targetRole: "LLM Engineer",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mode).toBe("career_path");
      }
    });

    it("rejects a missing target role", () => {
      const result = analyzeInputSchema.safeParse(careerBase);
      expect(result.success).toBe(false);
    });

    it("rejects a too-short (< 3 char) target role", () => {
      const result = analyzeInputSchema.safeParse({
        ...careerBase,
        targetRole: "AI",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a target role longer than 200 chars", () => {
      const result = analyzeInputSchema.safeParse({
        ...careerBase,
        targetRole: "x".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("rejects a supplied job description (it must be synthesized)", () => {
      const result = analyzeInputSchema.safeParse({
        ...careerBase,
        targetRole: "LLM Engineer",
        jobDescriptionText: base.jobDescriptionText,
      });
      expect(result.success).toBe(false);
    });

    it("accepts an empty-string job description alongside a target role", () => {
      const result = analyzeInputSchema.safeParse({
        ...careerBase,
        targetRole: "LLM Engineer",
        jobDescriptionText: "",
      });
      expect(result.success).toBe(true);
    });
  });
});
