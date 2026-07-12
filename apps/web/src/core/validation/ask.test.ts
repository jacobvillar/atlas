import { describe, it, expect } from "vitest";
import { askInputSchema } from "./ask";

const VALID_UUID = "11111111-1111-4111-8111-111111111111";

describe("askInputSchema", () => {
  it("accepts a valid reportId and question", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "What should I focus on first?",
    });
    expect(result.success).toBe(true);
  });

  it("trims the question", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "  How do I close my biggest gap?  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.question).toBe("How do I close my biggest gap?");
    }
  });

  it("rejects a non-uuid reportId", () => {
    const result = askInputSchema.safeParse({
      reportId: "not-a-uuid",
      question: "A valid question.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing reportId", () => {
    const result = askInputSchema.safeParse({
      question: "A valid question.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a question shorter than 3 characters", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "hi",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a question that is only whitespace", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a question longer than 1000 characters", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a question exactly at the 1000 character bound", () => {
    const result = askInputSchema.safeParse({
      reportId: VALID_UUID,
      question: "a".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});
