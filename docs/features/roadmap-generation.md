# Roadmap Quests

## Goal

Turn the fit analysis and retrieved career guidance into practical 30/60/90-day roadmap quests.

Atlas should feel lightly gamified, but not like a full lesson app. The product promise is: Atlas turns resume gaps into personalized career quests.

## Roadmap Sections

- 30 days: resume cleanup, quick skill refresh, application focus
- 60 days: portfolio project or deeper skill-building
- 90 days: interview prep, application tracking, networking actions

## Quest Shape

Each roadmap item should be generated as a quest:

- `questId`: stable ID within the report.
- `phase`: `30`, `60`, or `90`.
- `title`: short action title.
- `whyItMatters`: role-fit reason connected to a gap or requirement.
- `evidenceOutput`: concrete artifact the user can produce, such as a revised bullet, portfolio proof, practice answer, or outreach note.
- `timeEstimate`: realistic effort estimate.
- `difficulty`: `quick_win`, `moderate`, or `deep_work`.
- `status`: `not_started` or `completed`.

## Quality Bar

Roadmap items should be concrete enough that the user can act on them within a week.

The roadmap should work across early-career roles, not only technical roles. When the target role is non-technical, recommendations should focus on relevant business, communication, operations, portfolio, or domain evidence instead of forcing software/data projects.

## Lightweight Gamification

Included in v1:

- Progress bar for the current report's quests.
- Checkboxes or toggles for quest completion.
- "Next best quest" card.
- Milestone badges such as `Resume Ready`, `Proof Added`, and `Interview Prep Started`.
- Immediate visual feedback after quest completion.
- Completion count by phase.

Excluded from v1:

- Streaks.
- XP economy.
- Leaderboards.
- Competitive leagues.
- Mascot-led nudges.
- Push notifications.
- Daily lesson system.
- Generic career curriculum unrelated to the uploaded resume and target job.

## Acceptance Criteria

- Generated quests are tied to the target job and resume gaps.
- Quests are grouped into 30/60/90-day phases.
- Each quest has a concrete evidence output.
- User can mark a quest complete or incomplete.
- Completion status is scoped to the authenticated user and report.
