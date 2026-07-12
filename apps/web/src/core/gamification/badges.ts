// Professional milestone badges computed from completed quest categories,
// per report. Pure — no Supabase/OpenAI imports.

export const BADGE_CATEGORY_NAMES = {
  resume: "Resume Ready",
  skills: "Skill Builder",
  projects: "Proof Added",
  networking: "Outreach Ready",
  interview: "Interview Ready",
} as const;

export type BadgeCategory = keyof typeof BADGE_CATEGORY_NAMES;

const BADGE_CATEGORIES = Object.keys(
  BADGE_CATEGORY_NAMES,
) as BadgeCategory[];

export interface BadgeQuest {
  questId: string;
  category: string;
}

export interface Badge {
  id: BadgeCategory;
  name: string;
  earned: boolean;
}

export function computeBadges(
  quests: BadgeQuest[],
  completedQuestIds: ReadonlySet<string>,
): Badge[] {
  return BADGE_CATEGORIES.map((category) => {
    const categoryQuests = quests.filter((quest) => quest.category === category);
    const earned =
      categoryQuests.length > 0 &&
      categoryQuests.every((quest) => completedQuestIds.has(quest.questId));

    return {
      id: category,
      name: BADGE_CATEGORY_NAMES[category],
      earned,
    };
  });
}
