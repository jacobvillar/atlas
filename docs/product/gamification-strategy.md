# Gamification Strategy

Atlas uses professional gamification to make career preparation feel less vague and more actionable. It should not feel like a game layered on top of a serious career workflow.

## Reference Insight

The StriveCloud Duolingo gamification teardown highlights several useful retention patterns: bite-sized work, visual progress, immediate feedback, milestone rewards, habit loops, leaderboards, streaks, and personality-led nudges.

Atlas should adapt only the patterns that fit career readiness:

- Reduce the "wall of knowledge" by turning a broad career gap into small quests.
- Show visible progress so users know they are moving.
- Give immediate feedback when a quest is completed.
- Reward meaningful milestones without pretending completion guarantees hiring outcomes.

Source: https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo

## Atlas Position

Atlas is not "Duolingo for careers" in v1. It is a career readiness coach with a gamified roadmap layer.

The product metaphor:

```text
Resume + target job -> readiness report -> personalized quest board -> progress toward role readiness
```

## V1 Mechanics

Included in v1:

- Roadmap quests grouped into 30/60/90-day phases.
- Quest completion toggles.
- Report-level progress bar.
- "Next best quest" recommendation.
- Immediate visual feedback when a quest is completed.
- Calm milestone badges computed from completed quest categories.

Milestone examples:

- `Resume Ready`: key resume evidence quests completed.
- `Proof Added`: portfolio or work-sample quest completed.
- `Interview Prep Started`: first interview-readiness quest completed.
- `Outreach Started`: first networking quest completed.

## Out Of Scope For V1

Do not add:

- Streaks.
- XP points.
- Leaderboards.
- Competitive leagues.
- Push notifications.
- Mascot-led reminders.
- Social sharing.
- Generic daily lessons.

These mechanics are powerful for daily learning apps, but they can make a career tool feel noisy, stressful, or unserious.

## V2 Candidates

Possible later additions:

- Gentle reminders for unfinished quests.
- Due dates for quest phases.
- Weekly check-in summary.
- Optional streak-like consistency indicator without loss-aversion pressure.
- Shareable milestone card after the user explicitly opts in.

## Ethical Rules

- Do not create anxiety through streak loss or countdown pressure.
- Do not imply quest completion guarantees interviews or job offers.
- Do not compare users against each other.
- Do not gamify sensitive career data publicly.
- Keep progress scoped to the user's own report and target role.

## Success Metrics

- User completes at least one quest after generating a report.
- User can identify the next best quest within 10 seconds of opening the report.
- At least 3 validation users say the quest format made the roadmap easier to act on.
- Users describe Atlas as motivating without feeling childish or manipulative.
