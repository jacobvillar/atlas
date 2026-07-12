import { describe, it, expect } from "vitest";
import { todaysQuests } from "./today";

describe("todaysQuests", () => {
  it("returns an empty array when there are no quests", () => {
    expect(todaysQuests([], new Set())).toEqual([]);
  });

  it("returns an empty array when all quests are complete", () => {
    const quests = [
      { questId: "q1", phase: "30" },
      { questId: "q2", phase: "60" },
    ];
    const result = todaysQuests(quests, new Set(["q1", "q2"]));
    expect(result).toEqual([]);
  });

  it("orders incomplete quests by phase: 30 then 60 then 90", () => {
    const quests = [
      { questId: "q90", phase: "90" },
      { questId: "q30", phase: "30" },
      { questId: "q60", phase: "60" },
    ];
    const result = todaysQuests(quests, new Set());
    expect(result.map((q) => q.questId)).toEqual(["q30", "q60", "q90"]);
  });

  it("preserves array order within the same phase", () => {
    const quests = [
      { questId: "q30-b", phase: "30" },
      { questId: "q30-a", phase: "30" },
    ];
    const result = todaysQuests(quests, new Set());
    expect(result.map((q) => q.questId)).toEqual(["q30-b", "q30-a"]);
  });

  it("excludes completed quests", () => {
    const quests = [
      { questId: "q1", phase: "30" },
      { questId: "q2", phase: "30" },
      { questId: "q3", phase: "60" },
    ];
    const result = todaysQuests(quests, new Set(["q1"]));
    expect(result.map((q) => q.questId)).toEqual(["q2", "q3"]);
  });

  it("limits results to the requested count (default 3)", () => {
    const quests = [
      { questId: "q1", phase: "30" },
      { questId: "q2", phase: "30" },
      { questId: "q3", phase: "60" },
      { questId: "q4", phase: "90" },
    ];
    const result = todaysQuests(quests, new Set());
    expect(result).toHaveLength(3);
    expect(result.map((q) => q.questId)).toEqual(["q1", "q2", "q3"]);
  });

  it("respects a custom count", () => {
    const quests = [
      { questId: "q1", phase: "30" },
      { questId: "q2", phase: "30" },
    ];
    const result = todaysQuests(quests, new Set(), 1);
    expect(result).toHaveLength(1);
    expect(result[0].questId).toBe("q1");
  });

  it("is deterministic across repeated calls with the same input", () => {
    const quests = [
      { questId: "q1", phase: "60" },
      { questId: "q2", phase: "30" },
    ];
    const completed = new Set<string>();
    const first = todaysQuests(quests, completed);
    const second = todaysQuests(quests, completed);
    expect(first).toEqual(second);
  });
});
