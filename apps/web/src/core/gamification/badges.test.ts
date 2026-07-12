import { describe, it, expect } from "vitest";
import { computeBadges, BADGE_CATEGORY_NAMES } from "./badges";

describe("computeBadges", () => {
  it("returns all five badges, unearned, when there are no quests", () => {
    const badges = computeBadges([], new Set());
    expect(badges).toHaveLength(5);
    expect(badges.every((badge) => badge.earned === false)).toBe(true);
    expect(badges.map((badge) => badge.id)).toEqual([
      "resume",
      "skills",
      "projects",
      "networking",
      "interview",
    ]);
    expect(badges.map((badge) => badge.name)).toEqual([
      "Resume Ready",
      "Skill Builder",
      "Proof Added",
      "Outreach Ready",
      "Interview Ready",
    ]);
  });

  it("uses the fixed category-to-name mapping", () => {
    expect(BADGE_CATEGORY_NAMES).toEqual({
      resume: "Resume Ready",
      skills: "Skill Builder",
      projects: "Proof Added",
      networking: "Outreach Ready",
      interview: "Interview Ready",
    });
  });

  it("earns a badge only when all quests in that category are completed", () => {
    const quests = [
      { questId: "q1", category: "resume" },
      { questId: "q2", category: "resume" },
    ];
    const partial = computeBadges(quests, new Set(["q1"]));
    expect(partial.find((b) => b.id === "resume")?.earned).toBe(false);

    const full = computeBadges(quests, new Set(["q1", "q2"]));
    expect(full.find((b) => b.id === "resume")?.earned).toBe(true);
  });

  it("does not earn a badge for a category with zero quests", () => {
    const quests = [{ questId: "q1", category: "resume" }];
    const badges = computeBadges(quests, new Set(["q1"]));
    expect(badges.find((b) => b.id === "skills")?.earned).toBe(false);
    expect(badges.find((b) => b.id === "projects")?.earned).toBe(false);
    expect(badges.find((b) => b.id === "networking")?.earned).toBe(false);
    expect(badges.find((b) => b.id === "interview")?.earned).toBe(false);
  });

  it("computes independent earned status per category", () => {
    const quests = [
      { questId: "q1", category: "resume" },
      { questId: "q2", category: "skills" },
      { questId: "q3", category: "skills" },
      { questId: "q4", category: "interview" },
    ];
    const completed = new Set(["q1", "q2", "q3"]);
    const badges = computeBadges(quests, completed);

    expect(badges.find((b) => b.id === "resume")?.earned).toBe(true);
    expect(badges.find((b) => b.id === "skills")?.earned).toBe(true);
    expect(badges.find((b) => b.id === "interview")?.earned).toBe(false);
    expect(badges.find((b) => b.id === "projects")?.earned).toBe(false);
    expect(badges.find((b) => b.id === "networking")?.earned).toBe(false);
  });

  it("ignores unknown categories not in the fixed mapping", () => {
    const quests = [{ questId: "q1", category: "dancing" }];
    const badges = computeBadges(quests, new Set(["q1"]));
    expect(badges).toHaveLength(5);
    expect(badges.every((badge) => badge.earned === false)).toBe(true);
  });
});
