# Atlas Spec

## Product Summary

Atlas is a gamified, AI-powered career coach, roadmap, and tracker. It turns career preparation into an adventure: users complete quests to level up in real life, build real skills, grow their professional "aura" (presence and reputation), and evolve toward their target role. Atlas turns a resume PDF/DOCX and a target role into a structured role-fit report, a personalized quest roadmap with XP and readiness levels, and a focused follow-up chat called Ask Atlas.

v1 is themed around AI / ML engineering readiness (AI Engineer, ML Engineer, LLM / Applied-AI Engineer, MLOps Engineer). This is a soft scope: the analysis engine stays general and accepts any resume and any job description; only the curated RAG guidance, career-path presets, example copy, and the capstone demo center on AI engineering. The broad job market (all roles, non-tech) is v2.

Tone stays credible where it counts: adventure framing lives in the landing page, onboarding, and quest board, while the readiness report itself stays calm and professional. The fit score is guidance, not a hiring prediction, and rewards, XP, and levels are in-app progression only.

## MVP Scope

Atlas v1 includes:

- Supabase authentication before analysis.
- Resume upload for PDF and DOCX files.
- Python FastAPI document service using Docling for resume text extraction.
- User review/edit step for extracted resume text.
- Two target-role input modes into one pipeline, with the job description primary: (1) paste a target job description, or (2) choose/enter a target role as a career path, from which Atlas synthesizes a representative role profile stored as the report's job description text.
- Gamified progression: quests as the core action unit on a quest board, XP earned per completed quest, readiness levels / rank that rise with XP, in-app rewards (XP, rank-ups, badges, "aura" flourishes), and a "today's quests" view layered on the 30/60/90-day roadmap.
- RAG over a small curated career guidance knowledge base, themed to AI engineering in v1.
- OpenAI `gpt-4o-mini` for report generation and Ask Atlas.
- OpenAI `text-embedding-3-small` for career guidance embeddings.
- Structured resume evidence saved from the analysis, without storing the full raw resume text.
- Saved reports and Ask Atlas messages in Supabase.
- Personalized 30/60/90-day roadmap quests with lightweight completion tracking.
- Professional milestone badges computed from completed quest categories.
- Vercel deployment for the web app and Render/Railway deployment for the document service.

Atlas v1 does not include:

- LinkedIn scraping.
- Job board integrations.
- Automated applications.
- Payment processing.
- Long-term storage of raw resume files.
- Long-term storage of full raw resume text.
- Long-term chat memory beyond messages attached to a saved report.
- Leaderboards, competitive leagues, or ranking users against each other.
- Social or public sharing of career data.
- Streak-loss or countdown-pressure mechanics that create anxiety.
- Push notifications, mascot-led reminders, generic daily lessons, or generic curriculum paths.
- The broad, non-tech job market (all roles), which is v2.

## Inputs

- `resumeFile`: PDF or DOCX file uploaded by an authenticated user.
- `resumeText`: extracted and user-reviewed resume text.
- `jobDescriptionText`: pasted target job description.
- `targetRole`: optional user-provided role title.
- `askAtlasQuestion`: optional follow-up question after a report exists.

## Outputs

Atlas returns a structured report with:

- `fitScore`: readiness estimate from 0 to 100.
- `targetRole`: role inferred or supplied by the user.
- `roleRequirements`: key requirements extracted from the target job.
- `resumeEvidence`: normalized skills, tools, education, experience themes, project evidence, and constraints extracted from the resume.
- `summary`: plain-language role-fit summary.
- `strengths`: resume evidence that matches the role.
- `gaps`: missing or weak areas.
- `priorityActions`: highest-impact next actions.
- `resumeSuggestions`: concrete bullet and positioning suggestions.
- `roadmapQuests`: personalized quest items with stable `questId`, `phase`, `category`, action title, reason, evidence output, time estimate, XP value, and completion status.
- `readinessLevel`: current readiness level / rank derived from earned XP and completed quests.
- `xpTotal`: cumulative XP earned from completed quests.
- `milestoneBadges`: computed badge labels based on completed quest categories, framed within the leveling system.
- `projectSuggestion`: one portfolio project aligned to the role.
- `sourceTitles`: career guidance sources retrieved through RAG.
- `disclaimer`: career guidance disclaimer.

Ask Atlas returns:

- `answer`: direct response to the user question.
- `suggestedActions`: optional next steps.
- `sourceTitles`: career guidance sources retrieved through RAG.

## System Architecture

```text
atlas/
  apps/
    web/                         # Next.js app deployed to Vercel
  services/
    knowledge/
      document-service/           # FastAPI + Docling runtime extraction API
      rag/                        # offline career guidance ingestion/indexing
  supabase/
    migrations/                   # auth/profile/report/message/vector schema
  docs/
  spec.md
  CLAUDE.md
```

Runtime flow:

```text
Authenticated user
-> apps/web
-> services/knowledge/document-service extracts resume text with Docling
-> user reviews extracted text
-> apps/web retrieves career guidance chunks from Supabase pgvector
-> apps/web calls OpenAI gpt-4o-mini
-> apps/web saves structured resume evidence, report, quest progress, and messages in Supabase
```

Offline RAG flow:

```text
services/knowledge/rag/data/seed/*.md
-> chunk markdown
-> embed chunks with text-embedding-3-small
-> upsert career_resource_chunks in Supabase
```

## Data Model

Core Supabase tables (identity lives in `auth.users`; no `profiles` table in v1):

- `resume_documents`
- `career_reports`
- `roadmap_quest_progress`
- `ask_atlas_messages`
- `career_resource_chunks`

Privacy rules:

- Store resume metadata only (file name, type, status); do not store an extracted text preview.
- Do not store uploaded resume files in v1.
- Do not store full raw resume text in v1.
- Store a structured resume evidence summary generated during analysis so Ask Atlas can answer later without raw resume storage.
- Store generated report JSON and Ask Atlas messages.
- Store curated career guidance resources for RAG.
- Do not add user resumes to the RAG knowledge base in v1.

## API Surface

Web app API routes:

- `POST /api/extract-resume`: validate auth, proxy PDF/DOCX upload to the document service, return extracted text and metadata.
- `POST /api/analyze`: validate inputs, retrieve RAG context, call OpenAI, save report.
- `POST /api/ask`: validate report ownership, retrieve saved report and resume evidence context, retrieve RAG context, call OpenAI, save messages.
- `GET /api/reports`: list current user's saved reports.
- `GET /api/reports/[id]`: get a report owned by current user.

Document service API:

- `GET /api/health`: service health check.
- `POST /extract-resume`: accept PDF/DOCX, run Docling, return extracted markdown/text and metadata.

## Functional Requirements

1. User can sign up and sign in before analysis.
2. User can upload a PDF or DOCX resume.
3. Document service rejects unsupported files and files over the configured size limit.
4. Document service extracts resume content with Docling and discards the file.
5. User can review and edit extracted resume text before analysis.
6. User can provide a target role via either input mode: paste a target job description, or choose/enter a target role as a career path from which Atlas synthesizes a representative role profile.
7. App validates that resume text and job description text (pasted or synthesized) are present and long enough.
8. App retrieves relevant career guidance chunks through Supabase `pgvector`.
9. App sends the request only to server-side OpenAI calls.
10. AI response is validated against the expected output shape.
11. Generated structured resume evidence and report are saved for the authenticated user.
12. App renders the result as a readiness dashboard, not only a long text answer.
13. Dashboard shows fit score, strengths, gaps, priority actions, resume suggestions, 30/60/90-day roadmap quests, a quest board with a "today's quests" view, progress, earned XP, readiness level / rank, next best quest, and milestone badges.
14. Ask Atlas becomes available only after a report is generated.
15. Ask Atlas answers follow-up questions using the saved report, structured resume evidence, quest progress, and retrieved guidance.
16. User can view saved reports.
17. User can mark roadmap quests complete or incomplete; completing a quest awards XP and can raise the readiness level.
18. Earned XP, readiness level, and rewards are in-app progression only and never imply guaranteed interviews, offers, or hiring outcomes.
19. User can copy or export a report as Markdown.

## Non-Functional Requirements

- No API keys may be exposed client-side.
- Supabase row-level security must prevent cross-user access.
- Raw resume files must not be persisted in v1.
- Full raw resume text must not be persisted in v1.
- Typical analysis should complete in under 60 seconds after extraction.
- UI must be usable on desktop and mobile.
- CI must run meaningful engineering checks without adding docs-only gatekeeping.

## Acceptance Criteria

- Given a signed-in user and a valid PDF/DOCX resume, Atlas extracts text and shows it for review.
- Given valid reviewed resume text and a target role from either input mode, Atlas returns and saves a complete report.
- Given a career-path target role with no pasted job description, Atlas synthesizes a representative role profile and proceeds.
- Given missing resume text, Atlas shows a validation error.
- Given no target role from either input mode, Atlas shows a validation error.
- The generated report includes fit score, strengths, gaps, roadmap quests with XP values, readiness level, resume suggestions, and source titles.
- The dashboard includes a clear review state, a 30/60/90-day roadmap quest UI, a quest board, and a "today's quests" view.
- Roadmap quest completion persists for the authenticated user and report, and awards XP toward the readiness level.
- Milestone badges reflect completed quest categories, sit within the leveling system, and do not imply hiring outcomes.
- XP, readiness levels, and rewards are in-app progression only; no leaderboards, competitive ranking, or public sharing of career data.
- Ask Atlas is disabled until a report exists.
- Ask Atlas saves user and assistant messages linked to the report.
- A user cannot read another user's reports or Ask Atlas messages.
- OpenAI and Supabase secret keys are read only from server-side environment variables.
- CI runs lint, tests, and secrets scan on pull request or push.

## Test Plan

- Unit test input validation.
- Unit test report and Ask Atlas schemas.
- Unit test RAG chunk formatting and source metadata.
- Unit test prompt construction to ensure resume, job text, and retrieved context are included.
- API test unauthorized report access.
- API test unauthorized roadmap quest progress updates.
- Python test document-service file validation.
- Python test Docling extraction wrapper with a fixture or mocked converter.
- UI smoke test for sign-in, upload/review, generated report, and Ask Atlas states.
