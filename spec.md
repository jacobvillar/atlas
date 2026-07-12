# Atlas Spec

## 1. Context and Goal

Atlas is an authenticated, AI-powered career-readiness web app. A user uploads a resume, provides a target role, reviews the extracted resume text, and receives a saved readiness report with practical 30/60/90-day quests. Ask Atlas answers follow-up questions only after a report exists.

The core job is not to predict whether someone will be hired. It is to connect evidence already present in a resume to a specific target role, identify the highest-value gaps, and make the next action visible and trackable. The interface uses a private campaign metaphor for momentum; the report itself remains professional and evidence-led.

Atlas accepts a pasted job description for any role. Its initial career-path presets and curated resources focus on AI, data, and adjacent early-career roles.

## 2. Inputs and Outputs

### Inputs

| Input | Shape | Rules |
| --- | --- | --- |
| `resumeFile` | PDF or DOCX upload | Authenticated request only; file is validated and sent to the document service without persistent file storage. |
| `resumeText` | User-reviewed string | Required for analysis; never retained as full raw text after the request completes. |
| `jobDescriptionText` | User-provided string | Preferred target-role input; required unless Atlas synthesizes a profile for a selected career path. |
| `targetRole` | Optional string | Used to label the report and request a supported career-path profile. |
| `askAtlasQuestion` | String | Available only to the owner of an existing report. |

### Outputs

`POST /api/analyze` returns a saved, structured report containing:

- `fitScore` (0-100 guidance estimate), `targetRole`, `summary`, and `disclaimer`.
- `roleRequirements` and structured `resumeEvidence`.
- `strengths`, `gaps`, `priorityActions`, and `resumeSuggestions`.
- `roadmapQuests` with a stable `questId`, phase, category, action, evidence output, estimate, XP value, and completion state.
- `xpTotal`, `readinessLevel`, `milestoneBadges`, one `projectSuggestion`, and retrieved `sourceTitles`.

`POST /api/ask` returns a direct `answer`, optional `suggestedActions`, and retrieved `sourceTitles`.

## 3. Behavior Rules and Edge Cases

1. Require authentication before extraction, analysis, report retrieval, question answering, or quest updates.
2. Accept PDF and DOCX only. Reject an empty, unsupported, mismatched, or oversized upload before extraction; return a clear error and do not save the file.
3. Show the extracted resume text for user review. Do not analyze unreviewed or empty resume text.
4. Analyze only when a usable pasted job description or a supported selected career path is present. If a career path is selected, synthesize its representative role profile before the report call.
5. Retrieve only curated resource chunks from Supabase `pgvector`. Never index a user's resume or use one user's data to answer another user's request.
6. Call OpenAI only from server-side routes. Validate the model response against the report or Ask Atlas schema before saving or rendering it.
7. If extraction, retrieval, generation, or persistence fails, return a recoverable error state; do not create a partial report or award progress.
8. Scope every report, message, and quest-progress operation to the authenticated user and report ID. Reject cross-user access.
9. Completing a quest is idempotent: repeated completion requests do not award duplicate XP. Reopening a quest recalculates progress using persisted quest state.
10. Ask Atlas uses the current report, structured resume evidence, quest progress, and retrieved guidance. It is unavailable before the report exists and has no cross-report memory.
11. Fit scores, XP, readiness levels, badges, and career suggestions are guidance and in-app progress only. They must not claim hiring likelihood or a guaranteed outcome.

## 4. Technical Constraints

| Layer | Decision |
| --- | --- |
| Web application | Next.js App Router and TypeScript, deployed to Vercel. |
| Authentication and data | Supabase Auth, PostgreSQL, Row Level Security, and `pgvector`. |
| Document extraction | FastAPI service using `pypdfium2` for PDFs and `python-docx` for DOCX files, deployed to Render or Railway. |
| Generation | OpenAI `gpt-4o-mini` using server-side structured output. |
| Retrieval | OpenAI `text-embedding-3-small` over a small, curated Markdown knowledge base. |
| Persistence | Store report JSON, structured resume evidence, message history, and quest-progress state. Do not store uploaded files or full raw resume text. |
| Security and reliability | Environment variables for secrets; server-side validation; RLS ownership policies; a configured upload-size limit; typical analysis completes within 60 seconds after extraction. |
| Quality gates | GitHub Actions runs web lint, tests, build, Python tests, and secret scanning. |

## 5. Architecture and Data Flow

```text
Authenticated user
  -> Next.js web app
  -> FastAPI document service (temporary PDF/DOCX extraction)
  -> user review of extracted text
  -> Supabase pgvector retrieval of curated guidance
  -> server-side OpenAI analysis
  -> Supabase saves report, structured evidence, quests, and messages
  -> readiness dashboard and Ask Atlas
```

Offline RAG ingestion:

```text
services/knowledge/rag/data/seed/*.md
  -> chunking and embedding with text-embedding-3-small
  -> career_resource_chunks in Supabase
```

Core tables: `resume_documents`, `career_reports`, `roadmap_quest_progress`, `ask_atlas_messages`, and `career_resource_chunks`. Identity remains in `auth.users`.

## 6. Acceptance Criteria

1. Given an authenticated user and a valid PDF/DOCX, when they upload a resume, then Atlas extracts text and presents an editable review state without retaining the original file.
2. Given reviewed resume text and either a pasted job description or supported career path, when the user runs analysis, then Atlas validates input, retrieves curated guidance, saves one report, and returns a dashboard-ready result.
3. Given missing, empty, unsupported, or oversized input, when the user attempts extraction or analysis, then Atlas returns a specific validation error and creates no report.
4. Given a saved report, when its owner opens it, then they see the fit score, matched evidence, gaps, actions, source titles, resume suggestions, and 30/60/90-day quests.
5. Given an incomplete quest owned by the user, when they complete it, then its state persists and XP, readiness level, and eligible badges update exactly once.
6. Given a report exists, when its owner asks Ask Atlas a question, then Atlas answers with that report's context and retrieved guidance and saves the exchange under the report.
7. Given a user requests another user's report, messages, or quest progress, when the request reaches the API or Supabase, then access is denied.
8. Given production deployment, when the CI workflow runs on push or pull request, then lint, unit tests, build, Python tests, and secret scanning complete successfully without exposing secrets.

## 7. Verification Plan

- Unit-test validation, output schemas, prompt construction, RAG source metadata, quest XP/level logic, and idempotent completion.
- API-test authentication, ownership checks, extraction input errors, analysis error handling, and Ask Atlas availability.
- Test file validation and the extraction wrapper with a mocked parser or fixture.
- Smoke-test the user journey: sign in, upload, review, analyze, view report, complete a quest, ask a question, and reopen the report.
