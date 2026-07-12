// "Today's quests" surfaces the next few incomplete quests for a report,
// ordered by phase (30 then 60 then 90) then array order within phase. Pure —
// no dates/scheduler — so the same input always yields the same output.

const PHASE_ORDER = ["30", "60", "90"] as const;

export interface TodayQuest {
  questId: string;
  phase: string;
}

export function todaysQuests<T extends TodayQuest>(
  quests: T[],
  completedQuestIds: ReadonlySet<string>,
  count = 3,
): T[] {
  const incomplete = quests.filter(
    (quest) => !completedQuestIds.has(quest.questId),
  );

  const ranked = [...incomplete].sort((a, b) => {
    const aRank = PHASE_ORDER.indexOf(a.phase as (typeof PHASE_ORDER)[number]);
    const bRank = PHASE_ORDER.indexOf(b.phase as (typeof PHASE_ORDER)[number]);
    const aIndex = aRank === -1 ? PHASE_ORDER.length : aRank;
    const bIndex = bRank === -1 ? PHASE_ORDER.length : bRank;
    return aIndex - bIndex;
  });

  return ranked.slice(0, count);
}
