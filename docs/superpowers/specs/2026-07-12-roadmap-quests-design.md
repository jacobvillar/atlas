# Atlas Roadmap Quests Design

## Goal

Add lightweight gamification to Atlas by turning generated roadmap actions into personalized career quests.

Atlas should not become a Duolingo clone in v1. The experience should stay professional and focused on career readiness.

## Product Principle

ChatGPT gives advice. Atlas turns resume gaps into a trackable quest board tied to one target role.

Reference principle: adopt the parts of gamification that reduce overwhelm and make progress visible. Avoid mechanics that create pressure, social comparison, or daily habit obligations in v1.

## User Flow

1. User uploads or pastes a resume.
2. User pastes a target job description.
3. Atlas generates a readiness report.
4. Atlas generates roadmap quests grouped by 30/60/90-day phase.
5. User marks quests complete as they work through the plan.
6. Dashboard shows progress and the next best quest.

## Quest Schema

```ts
type RoadmapQuest = {
  questId: string;
  phase: "30" | "60" | "90";
  title: string;
  whyItMatters: string;
  evidenceOutput: string;
  timeEstimate?: string;
  difficulty: "quick_win" | "moderate" | "deep_work";
  category:
    | "resume_evidence"
    | "skill_gap"
    | "portfolio_proof"
    | "application_readiness"
    | "interview_readiness"
    | "networking";
};
```

Progress schema:

```ts
type RoadmapQuestProgress = {
  questId: string;
  status: "not_started" | "completed";
  completedAt?: string;
};
```

## UI Requirements

- Group quests into 30/60/90-day tabs or columns.
- Show a progress bar for the current report.
- Show a "Next best quest" card.
- Use checkboxes or toggles for completion.
- Show calm milestone badges based on completed categories.
- Show immediate visual feedback when completion is saved.

## Data Rules

- Store generated quests in `career_reports.report_json`.
- Store mutable completion state in `roadmap_quest_progress`.
- Verify report ownership before reading or updating progress.
- Do not recalculate the original fit score when quests are completed.

## Out Of Scope

- XP points.
- Streaks.
- Leaderboards.
- Competitive leagues.
- Notifications.
- Mascot-led nudges.
- Daily lesson engine.
- Generic curriculum unrelated to the user's resume and target role.

## Acceptance Criteria

- A generated report includes roadmap quests.
- Each quest has an evidence output.
- User can mark a quest complete.
- Progress persists after refresh.
- Milestone badges update based on completed quest categories.
- User cannot update another user's quest progress.
- UI avoids hiring guarantees and heavy game language.
