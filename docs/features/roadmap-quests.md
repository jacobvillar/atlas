# Roadmap Quests

## Product Idea

Atlas is not a Duolingo clone. It borrows one useful idea from learning products: small visible next steps.

After Atlas analyzes a resume against a target role, it turns the user's gaps into personalized career quests. Each quest is tied to the specific report, role, and readiness gaps.

## Why This Matters

Generic AI career advice often ends as a long list. Users still need to decide what to do first, how to measure progress, and whether the advice connects to the target role.

Roadmap quests make Atlas more useful than a one-off chat answer:

- The plan is specific to the user's resume and target job.
- The next action is visible.
- Progress is trackable.
- The user can return to the report and continue.

This follows the useful part of learning-app gamification: reduce overwhelm, show progress, and reward small wins. Atlas should avoid mechanics that create pressure or competition.

## V1 Scope

Included:

- AI-generated quests grouped by 30/60/90-day phase.
- Quest completion toggles.
- Report-level progress bar.
- "Next best quest" card.
- Simple milestone badges based on completed quest categories.
- Immediate visual feedback when a quest is completed.

Not included:

- Daily streaks.
- XP points.
- Leaderboards.
- Competitive leagues.
- Notifications.
- Mascot-led nudges.
- Social sharing.
- Generic daily lessons.

## Quest Categories

- Resume evidence: improve or add bullet proof.
- Skill gap: practice or learn a specific role requirement.
- Portfolio proof: create a small artifact or project.
- Application readiness: tailor materials and application strategy.
- Interview readiness: prepare examples and role-specific answers.
- Networking: outreach or informational interview action.

## Completion Rules

- Completion is user-controlled.
- Completing a quest updates progress, but does not change the original fit score automatically.
- Progress is scoped to one report.
- Quest status should persist across sessions.
- Quest progress should not imply a hiring prediction.

## Milestone Badges

Milestone badges are computed from quest progress and do not require a separate v1 table.

Examples:

- `Resume Ready`: resume evidence quests completed.
- `Proof Added`: portfolio proof quest completed.
- `Interview Prep Started`: interview readiness quest completed.
- `Outreach Started`: networking quest completed.

Badges are private by default and should not include social sharing in v1.

## UX Rules

- Use checkboxes or toggles, not complex gamified controls.
- Use calm milestone badges, not playful achievement language.
- Keep the tone professional and encouraging.
- Always tie quests back to the target role or resume gap.
