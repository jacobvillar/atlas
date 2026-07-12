import { describe, it, expect } from "vitest";
import { computeProgression, RANKS } from "./levels";

describe("computeProgression", () => {
  it("returns Base Camp with zero percent when no quests exist", () => {
    const result = computeProgression([], new Set());
    expect(result).toEqual({
      earnedXp: 0,
      totalXp: 0,
      percent: 0,
      rankIndex: 0,
      rankName: "Base Camp",
    });
  });

  it("treats missing/undefined xp as 0 for old reports", () => {
    const quests = [{ questId: "q1" }, { questId: "q2", xp: undefined }];
    const result = computeProgression(quests, new Set(["q1", "q2"]));
    expect(result.totalXp).toBe(0);
    expect(result.earnedXp).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.rankName).toBe("Base Camp");
  });

  it("computes partial progress and rank", () => {
    const quests = [
      { questId: "q1", xp: 50 },
      { questId: "q2", xp: 75 },
      { questId: "q3", xp: 100 },
    ];
    // earned 50 / total 225 => ~22% => Base Camp (below 25 threshold)
    const result = computeProgression(quests, new Set(["q1"]));
    expect(result.earnedXp).toBe(50);
    expect(result.totalXp).toBe(225);
    expect(result.percent).toBe(22);
    expect(result.rankName).toBe("Base Camp");
  });

  it("reaches Explorer at 25 percent or more", () => {
    const quests = [
      { questId: "q1", xp: 25 },
      { questId: "q2", xp: 75 },
    ];
    // earned 25 / total 100 = 25%
    const result = computeProgression(quests, new Set(["q1"]));
    expect(result.percent).toBe(25);
    expect(result.rankName).toBe("Explorer");
  });

  it("reaches Pathfinder at 50 percent", () => {
    const quests = [
      { questId: "q1", xp: 50 },
      { questId: "q2", xp: 50 },
    ];
    const result = computeProgression(quests, new Set(["q1"]));
    expect(result.percent).toBe(50);
    expect(result.rankName).toBe("Pathfinder");
  });

  it("reaches Trailblazer at 75 percent", () => {
    const quests = [
      { questId: "q1", xp: 75 },
      { questId: "q2", xp: 25 },
    ];
    const result = computeProgression(quests, new Set(["q1"]));
    expect(result.percent).toBe(75);
    expect(result.rankName).toBe("Trailblazer");
  });

  it("only reaches Summit Ready when all XP is earned (100 percent)", () => {
    const quests = [
      { questId: "q1", xp: 50 },
      { questId: "q2", xp: 50 },
    ];
    const all = computeProgression(quests, new Set(["q1", "q2"]));
    expect(all.percent).toBe(100);
    expect(all.rankName).toBe("Summit Ready");
    expect(all.rankIndex).toBe(RANKS.length - 1);
  });

  it("does not award Summit Ready for high-but-incomplete rounding to 100", () => {
    // Contrived case: rounding could theoretically push percent to 100 without
    // full completion; guard against that by asserting completeness is required.
    const quests = [
      { questId: "q1", xp: 999 },
      { questId: "q2", xp: 1 },
    ];
    const result = computeProgression(quests, new Set(["q1"]));
    expect(result.earnedXp).toBeLessThan(result.totalXp);
    expect(result.rankName).not.toBe("Summit Ready");
  });

  it("ignores completed quest ids not present in the report's quest list", () => {
    const quests = [{ questId: "q1", xp: 100 }];
    const result = computeProgression(quests, new Set(["q1", "unrelated-quest"]));
    expect(result.earnedXp).toBe(100);
    expect(result.totalXp).toBe(100);
    expect(result.rankName).toBe("Summit Ready");
  });
});
