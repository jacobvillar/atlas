// Per-report progression, computed on read from the report's own roadmap
// quests and the caller's completed-quest set. Pure — no Supabase/OpenAI
// imports — so it can be unit tested and reused by UI and server code alike.

export const RANKS = [
  "Base Camp",
  "Explorer",
  "Pathfinder",
  "Trailblazer",
  "Summit Ready",
] as const;

export type RankName = (typeof RANKS)[number];

// Percent-of-total-XP threshold each rank requires, aligned index-for-index
// with RANKS. "Summit Ready" only at 100% (all XP earned).
const RANK_THRESHOLDS = [0, 25, 50, 75, 100] as const;

export interface ProgressionQuest {
  questId: string;
  xp?: number;
}

export interface Progression {
  earnedXp: number;
  totalXp: number;
  percent: number;
  rankIndex: number;
  rankName: RankName;
}

export function computeProgression(
  quests: ProgressionQuest[],
  completedQuestIds: ReadonlySet<string>,
): Progression {
  let totalXp = 0;
  let earnedXp = 0;

  for (const quest of quests) {
    const xp = quest.xp ?? 0;
    totalXp += xp;
    if (completedQuestIds.has(quest.questId)) {
      earnedXp += xp;
    }
  }

  const percent = totalXp === 0 ? 0 : Math.round((earnedXp / totalXp) * 100);

  let rankIndex = 0;
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i -= 1) {
    if (percent >= RANK_THRESHOLDS[i]) {
      rankIndex = i;
      break;
    }
  }
  // "Summit Ready" (the final threshold) requires all XP earned, not merely
  // reaching 100 by rounding with zero total.
  if (rankIndex === RANK_THRESHOLDS.length - 1 && earnedXp < totalXp) {
    rankIndex = RANK_THRESHOLDS.length - 2;
  }

  return {
    earnedXp,
    totalXp,
    percent,
    rankIndex,
    rankName: RANKS[rankIndex],
  };
}
