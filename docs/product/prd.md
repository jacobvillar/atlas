# Atlas PRD

## Problem Statement

Fresh graduates, early-career professionals, and career shifters often have a resume and a target role but cannot tell which evidence is strong, what is missing, or what to do next. Resume editors and generic chat prompts can improve individual bullets, but they leave the user to assemble context, assess the advice, and turn it into a sustained plan.

Atlas turns one resume and one target role into a private readiness report and a practical campaign of next steps. It provides career guidance, not a hiring prediction or a promise of an outcome.

## Target Users

Primary users are fresh graduates and early-career professionals preparing for their first or next role. They need a clear way to connect coursework, projects, internships, and early work experience to a job they want.

Secondary users are career shifters who need to translate transferable experience into credible evidence for a new field. Atlas accepts any pasted job description; its initial career-path presets and curated guidance focus on AI, data, and adjacent early-career roles.

## Core Features

| Feature | MVP behavior and acceptance criterion |
| --- | --- |
| Account and privacy | A user signs up or signs in before analysis. Reports, quest progress, and messages are visible only to their account; Atlas does not retain uploaded resume files or full raw resume text. |
| Resume intake | A user uploads a PDF or DOCX resume. Atlas extracts text with a private document service, rejects unsupported, mismatched, or oversized files, and lets the user edit the extracted text before analysis. |
| Target-role setup | A user pastes a job description or selects/enters a supported career path. Atlas validates that it has reviewed resume text and a usable target-role description before it runs analysis. |
| Readiness report | Atlas produces and saves a structured report with a guidance-only fit score, matched evidence, gaps, priority actions, resume suggestions, and sources from curated career guidance. |
| Career campaign | Atlas converts report gaps into 30/60/90-day quests. A user can complete or reopen a quest and immediately sees the related progress, XP, readiness level, and earned badge updates. These are private in-app motivators, not measures of employability. |
| Ask Atlas and export | After a report exists, a user can ask focused follow-up questions using that report's context and can copy or download the report as Markdown. |

## Out of Scope

- LinkedIn scraping, job-board integrations, and automated job applications.
- Payments, public profiles, sharing, leaderboards, leagues, or streak-loss mechanics.
- Hiring probability, interview, offer, or salary guarantees.
- Long-term storage of uploaded resume files or complete raw resume text.
- User resumes as RAG source material, long-term cross-report chat memory, and streamed chat responses.
- A generic career curriculum, push notifications, and mascot-led reminders.

## Success Metrics

- A signed-in user can generate and save a complete report from a valid resume and target role in under 60 seconds after extraction.
- Every completed report includes a fit score, strengths, gaps, resume actions, source titles, and 30/60/90-day quests.
- A user can complete one quest and see progress update without reloading or losing state.
- A user can ask one follow-up question after analysis and retrieve the same report later from their account.
- At least three validation users report that Atlas clarified their next career action.
- The deployed app works in an incognito browser with its core analysis flow available.

## Open Questions

- Which production host will run the document service: Render or Railway?
- What upload-size limit is appropriate for a typical resume while preserving Vercel and document-service limits?
- Should users be able to delete saved reports in v1?
- Which additional public, licensed career resources should be added to the initial RAG seed set?
