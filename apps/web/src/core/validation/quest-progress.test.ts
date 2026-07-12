import { describe, it, expect } from "vitest";
import { questProgressInputSchema } from "./quest-progress";

describe("questProgressInputSchema", () => {
  it("accepts status: completed", () => {
    const result = questProgressInputSchema.safeParse({ status: "completed" });
    expect(result.success).toBe(true);
  });

  it("accepts status: not_started", () => {
    const result = questProgressInputSchema.safeParse({ status: "not_started" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    const result = questProgressInputSchema.safeParse({ status: "in_progress" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing status", () => {
    const result = questProgressInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects null input", () => {
    const result = questProgressInputSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});
