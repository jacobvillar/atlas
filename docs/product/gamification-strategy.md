# Gamification Strategy

Atlas uses adventure-framed gamification to make career preparation feel like something you level up in, not a vague chore. Landing, onboarding, and the quest board carry the hype; the readiness report and fit score underneath stay calm, credible, and evidence-based.

## Reference Insight

The StriveCloud Duolingo gamification teardown highlights several useful retention patterns: bite-sized work, visual progress, immediate feedback, milestone rewards, habit loops, leaderboards, streaks, and personality-led nudges.

Atlas adapts the patterns that fit career readiness and layers in leveling mechanics of its own:

- Reduce the "wall of knowledge" by turning a broad career gap into small quests.
- Show visible progress (XP, levels, aura) so users feel like they are advancing.
- Give immediate feedback when a quest is completed.
- Reward meaningful milestones without pretending completion guarantees hiring outcomes.

Atlas deliberately skips leaderboards, competitive leagues, and streak-loss pressure — see Out of Scope below.

Source: https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo

## Atlas Position

Atlas is a gamified career coach, roadmap, and tracker. It turns career preparation into an adventure: you level up in real life, build real skills, grow your professional "aura" (presence/reputation), and evolve with every quest you complete. The hype lives in the landing, onboarding, and quest board experience — the readiness report and fit score underneath stay calm, credible, and evidence-based.

The product metaphor:

```text
Resume + target job -> readiness report -> personalized quest board -> level up toward role readiness
```

Atlas accepts any pasted job description. Initial career-path presets, example content, and curated RAG guidance focus on AI, data, and adjacent early-career roles; the analysis flow does not reject another target role.

## V1 Mechanics

Included in v1:

- Roadmap quests grouped into 30/60/90-day phases (the roadmap stays the structural backbone).
- A "today's quests" view layered on top of the roadmap: surfaces the next actionable quests day-to-day so it feels like an ongoing adventure, without any streak-loss or countdown pressure.
- Quest board as the core action unit.
- Quest completion toggles.
- XP earned from completing quests.
- Readiness levels/rank that rise as XP accumulates ("evolve," level up).
- Rewards for completing quests and hitting milestones — in-app progression only (XP, rank-ups, badges, cosmetic/aura flourishes).
- "Aura" as playful progression flavor representing professional presence/reputation.
- Report-level progress bar.
- "Next best quest" recommendation.
- Immediate visual feedback when a quest is completed.
- Milestone badges computed from completed quest categories, now framed within the leveling system.

Milestone examples:

- `Resume Ready`: key resume evidence quests completed.
- `Proof Added`: portfolio or work-sample quest completed.
- `Interview Prep Started`: first interview-readiness quest completed.
- `Outreach Started`: first networking quest completed.

## Out Of Scope For V1

Do not add:

- Leaderboards.
- Competitive leagues or ranking users against each other.
- Social or public sharing of career data.
- Streak-loss mechanics or countdown pressure that create anxiety.
- Push notifications.
- Mascot-led reminders.
- Generic daily lessons or curriculum.

These mechanics either compare users publicly or create anxiety-driven pressure, which works against a credible career tool even when the surrounding experience is playful.

## V2 Candidates

Possible later additions:

- A comprehensive preset library for every role and industry.
- Due dates for quest phases.
- Weekly check-in summary.
- Shareable milestone card after the user explicitly opts in.

## Ethical Rules

- Rewards, XP, and levels are in-app progression only. Never imply that completing quests guarantees interviews, offers, or hiring outcomes.
- Do not create anxiety through streak loss or countdown pressure.
- Do not compare users against each other.
- Do not gamify sensitive career data publicly.
- Keep progress scoped to the user's own report and target role.
- The fit score remains guidance, not a hiring prediction or guarantee.

## Success Metrics

- User completes at least one quest after generating a report.
- User can identify the next best quest within 10 seconds of opening the report.
- At least 3 validation users say the quest format made the roadmap easier to act on.
- Users describe Atlas as motivating without feeling childish or manipulative.
