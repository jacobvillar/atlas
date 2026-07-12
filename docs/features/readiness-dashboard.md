# Readiness Dashboard

## Goal

The readiness dashboard is the main Atlas product experience. It turns AI output into a clear, scannable career plan so users do not need to interpret a long chat transcript.

The dashboard should feel lightly gamified through personalized roadmap quests, not through generic lessons, streaks, or leaderboards.

## Sections

- Header: target role, fit score, report date, export button.
- Review: plain-language summary of current readiness.
- Role Requirements: key skills, tools, experience, and traits from the job description.
- Strengths: resume evidence that already matches the role.
- Gaps: missing or weak evidence, ordered by importance.
- Priority Actions: 3-5 actions the user should do first.
- Resume Improvements: suggested bullet rewrites and evidence to add.
- Roadmap Quests: 30/60/90-day tabs or columns with completion toggles.
- Progress: completion count and progress bar for the current report's quests.
- Next Best Quest: the most important incomplete quest.
- Milestone Badges: private, professional badges based on completed quest categories.
- Portfolio/Project: one practical project or proof-of-work suggestion when useful.
- Sources: career guidance titles retrieved through RAG.
- Ask Atlas: report-specific follow-up chat.

## Roadmap Quest UI

The roadmap should be visual, action-oriented, and trackable:

- 30 days: quick wins, resume cleanup, skill refresh, applications to start.
- 60 days: deeper practice, portfolio/project work, networking.
- 90 days: interview readiness, application tracking, stronger positioning.

Each roadmap quest should have:

- Action title.
- Why it matters.
- Suggested output or evidence.
- Time estimate when possible.
- Difficulty label.
- Completion state.
- Immediate completion feedback.

## Differentiation From Generic Chat

ChatGPT can answer career questions, but the user must supply context, design prompts, remember prior advice, and convert text into a plan. Atlas differentiates by providing a guided upload-to-report workflow, structured validation, saved reports, RAG-backed guidance, and a dashboard that turns gaps into trackable next steps.

## Acceptance Criteria

- A generated report renders as structured dashboard sections.
- The top three priority actions are visible without scrolling on desktop.
- The roadmap is grouped into 30/60/90-day quest sections.
- The dashboard shows quest progress for the current report.
- The user can mark a quest complete and see progress update.
- Milestone badges update based on completed quest categories.
- Ask Atlas is visually attached to the current report.
- Source titles are visible for RAG-supported guidance.
