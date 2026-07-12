import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { roleProfileOutputSchema } from "./schemas";

// Live AI integration test for career-path role synthesis (ATLAS-006A). Skipped
// automatically when no OpenAI key is available, so it never breaks CI; run it
// locally with a configured key to verify real model behavior (schema
// conformance + that the output reads like a credible role profile).
function loadEnv() {
  try {
    const text = readFileSync(new URL("../../../.env.local", import.meta.url), "utf8");
    const key = text.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
    const base = text.match(/^OPENAI_BASE_URL=(.+)$/m)?.[1]?.trim();
    if (key) process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || key;
    if (base) process.env.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || base;
  } catch {
    // No .env.local — rely on whatever is already in the environment.
  }
}
loadEnv();

const hasKey = Boolean(process.env.OPENAI_API_KEY);
const liveIt = hasKey ? it : it.skip;

describe("synthesizeRoleProfile (live)", () => {
  liveIt(
    "returns a schema-valid, credible role profile for a target role",
    async () => {
      const { synthesizeRoleProfile } = await import("./openai");
      const profile = await synthesizeRoleProfile("LLM Engineer");

      // Print for human review (HITL): the profile contains no user data.
      console.log("\n===== SAMPLE ROLE PROFILE (LLM Engineer) =====\n");
      console.log(profile);
      console.log("\n===== END SAMPLE ROLE PROFILE =====\n");

      expect(roleProfileOutputSchema.safeParse({ roleProfile: profile }).success).toBe(true);
      expect(profile.length).toBeGreaterThanOrEqual(200);
    },
    60000,
  );
});
