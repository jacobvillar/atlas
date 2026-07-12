# Atlas MVP Tickets

These tickets break the Atlas MVP into vertical slices that can be picked up by coding agents or a human developer. Each ticket should produce a usable, testable increment.

Status key:

- `AFK`: an agent can implement with the existing docs and environment.
- `HITL`: a human should review or provide a decision before completion.

## Ticket ATLAS-001: Public Site and Brand Shell

Type: `HITL`

### Goal

Create the first public-facing Atlas experience with Home, Use Cases, Privacy, FAQ, About, Login, and Sign up for free navigation.

### Expected Output

- Public pages exist and render without authentication.
- Public navigation appears consistently across public pages.
- Atlas logo/mark is used.
- Homepage explains the product as a career readiness coach with roadmap quests.
- Privacy page clearly states resume file and full raw resume text are not stored in v1.
- Public nav links to `/login` and `/signup`.
- Auth routes may show static shell content here, but actual Supabase forms belong to ATLAS-002.

### Files Likely Involved

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/use-cases/page.tsx`
- `apps/web/src/app/privacy/page.tsx`
- `apps/web/src/app/faq/page.tsx`
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/signup/page.tsx`
- `apps/web/src/modules/public-site/components/public-nav.tsx`
- `apps/web/src/modules/public-site/components/public-footer.tsx`
- `apps/web/src/modules/public-site/content/faq.ts`
- `apps/web/src/modules/public-site/content/use-cases.ts`
- `apps/web/src/app/globals.css`
- `docs/assets/atlas-logo.svg`
- `docs/assets/atlas-mark.svg`

### Dependencies

- Existing brand guidelines.
- Existing public-site design spec.

### Blockers

- None.

### Human Review

Required. Review tone, brand, logo placement, and whether the public copy feels professional rather than too playful.

## Ticket ATLAS-002: Supabase Auth, Schema, and RLS Foundation

Type: `HITL`

### Goal

Set up Supabase authentication, core database tables, row-level security, and server/browser Supabase clients.

### Expected Output

- Users can sign up and sign in.
- Login page uses `Welcome back` and `Continue your career roadmap.`
- Signup page uses `Start mapping your next career move` and explains that accounts save reports, quests, and Ask Atlas chats.
- Login and signup pages include working Supabase auth forms.
- Protected routes redirect unauthenticated users.
- Core tables exist: `profiles`, `resume_documents`, `career_reports`, `roadmap_quest_progress`, `ask_atlas_messages`, and `career_resource_chunks`.
- RLS prevents cross-user access.
- Supabase browser and server clients are available to the web app.

### Files Likely Involved

- `supabase/migrations/001_profiles_and_reports.sql`
- `supabase/migrations/002_career_resources.sql`
- `apps/web/src/core/supabase/server.ts`
- `apps/web/src/core/supabase/browser.ts`
- `apps/web/src/core/auth/`
- `apps/web/src/modules/auth/components/login-form.tsx`
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/signup/page.tsx`
- `apps/web/src/app/(app)/layout.tsx`
- `.env.example`

### Dependencies

- Ticket ATLAS-001 for public nav linking to login/signup.

### Blockers

- Supabase project credentials must be available locally and in deployment.
- Human must confirm whether email/password auth is enough for v1.

### Human Review

Required. Review RLS policies, environment variable names, and auth UX before moving on.

## Ticket ATLAS-003: Career Dashboard Shell

Type: `AFK`

### Goal

Create the authenticated dashboard shell that becomes the user's home after login.

### Expected Output

- `/dashboard` is protected.
- Dashboard shows an empty state for first-time users.
- Dashboard shows entry point for a new analysis.
- Dashboard has placeholders for recent reports, active quest preview, roadmap progress, and milestone badges.
- No AI calls are required yet.

### Files Likely Involved

- `apps/web/src/app/(app)/dashboard/page.tsx`
- `apps/web/src/modules/career-dashboard/components/`
- `apps/web/src/modules/career-dashboard/hooks/`
- `apps/web/src/modules/reports/queries/`
- `apps/web/src/modules/roadmap/components/`
- `apps/web/src/core/auth/`

### Dependencies

- Ticket ATLAS-002.

### Blockers

- None after auth is working.

### Human Review

Optional. Recommended for visual layout and dashboard information hierarchy.

## Ticket ATLAS-004: Document Service and Resume Extraction Flow

Type: `AFK`

### Goal

Implement PDF/DOCX resume extraction with FastAPI + Docling and connect it to the web upload/review flow.

### Expected Output

- Document service exposes `GET /api/health`.
- Document service exposes `POST /extract-resume`.
- Unsupported file types and oversized files are rejected.
- Resume files are processed temporarily and not stored.
- Web app exposes `POST /api/extract-resume` as the authenticated server-side proxy.
- Web user can upload a PDF/DOCX resume and review extracted text before analysis.
- Resume metadata and extracted preview can be saved under the authenticated user.

### Files Likely Involved

- `services/knowledge/document-service/app/main.py`
- `services/knowledge/document-service/app/extraction.py`
- `services/knowledge/document-service/app/validation.py`
- `services/knowledge/document-service/tests/`
- `services/knowledge/document-service/requirements.txt`
- `apps/web/src/modules/analysis-workbench/components/resume-upload.tsx`
- `apps/web/src/modules/analysis-workbench/components/extracted-resume-review.tsx`
- `apps/web/src/app/api/extract-resume/route.ts`
- `apps/web/src/core/validation/resume.ts`
- `.env.example`

### Dependencies

- Ticket ATLAS-002.

### Blockers

- Docling dependency installation may need environment tuning.
- Deployment host for the Python service must be selected later.

### Human Review

Required for privacy behavior. Confirm uploaded files are not persisted and raw resume text is not logged.

## Ticket ATLAS-005: Curated Career Guidance RAG Ingestion

Type: `AFK`

### Goal

Build the curated career guidance RAG ingestion pipeline.

### Expected Output

- Seed Markdown files exist for resume writing, STAR/interview answers, portfolio/project advice, early-career job search, and a bootcamp/career note.
- Ingestion loads Markdown, chunks content, embeds with `text-embedding-3-small`, and upserts to Supabase `career_resource_chunks`.
- Tests cover chunking and source metadata preservation.

### Files Likely Involved

- `services/knowledge/rag/data/seed/*.md`
- `services/knowledge/rag/app/ingestion/loader.py`
- `services/knowledge/rag/app/ingestion/parser.py`
- `services/knowledge/rag/app/ingestion/chunker.py`
- `services/knowledge/rag/app/embeddings/embedder.py`
- `services/knowledge/rag/app/vectorstore/supabase_vectorstore.py`
- `services/knowledge/rag/scripts/load_career_resources.py`
- `services/knowledge/rag/tests/`
- `supabase/migrations/002_career_resources.sql`

### Dependencies

- Ticket ATLAS-002.

### Blockers

- OpenAI key must support `text-embedding-3-small`.
- Human must confirm initial seed sources or provide personal notes.

### Human Review

Required for source selection and citation quality.

## Ticket ATLAS-006: Analysis API, AI Schemas, and Prompting

Type: `HITL`

### Goal

Implement the server-side analysis flow that turns reviewed resume text and a target job description into a validated readiness report with roadmap quests.

### Expected Output

- `POST /api/analyze` requires authentication.
- Inputs are validated before AI calls.
- Runtime RAG context is retrieved through `apps/web/src/core/rag/retrieve.ts` and included in the prompt.
- OpenAI `gpt-4o-mini` returns structured JSON.
- Output is validated before saving.
- Report is saved under the current user.
- Structured `resume_evidence_json` is saved without storing full raw resume text.
- Initial `roadmap_quest_progress` rows are created.
- Response includes fit score, strengths, gaps, resume suggestions, roadmap quests, source titles, and disclaimer.

### Files Likely Involved

- `apps/web/src/app/api/analyze/route.ts`
- `apps/web/src/core/validation/analyze.ts`
- `apps/web/src/core/ai/openai.ts`
- `apps/web/src/core/ai/prompts.ts`
- `apps/web/src/core/ai/schemas.ts`
- `apps/web/src/core/rag/retrieve.ts`
- `apps/web/src/modules/analysis-workbench/actions/`
- `apps/web/src/modules/readiness-report/schemas/`
- `apps/web/src/modules/roadmap/types/`
- `apps/web/src/core/ai/*.test.ts`

### Dependencies

- Ticket ATLAS-002.
- Ticket ATLAS-004.
- Ticket ATLAS-005.

### Blockers

- OpenAI API key must be configured.
- Prompt output may need iteration with sample resumes and job descriptions.

### Human Review

Required. Review AI output quality, disclaimer language, and whether quests are specific enough.

## Ticket ATLAS-007: Analysis Workbench UI

Type: `AFK`

### Goal

Build the guided UI for one complete analysis: resume review, job description input, target role, and generate report action.

### Expected Output

- `/analysis/new` is protected.
- User can review extracted resume text.
- User can paste a target job description.
- User can optionally provide a target role.
- Validation errors are clear.
- Generate button calls `/api/analyze`.
- Successful analysis navigates to the saved report detail page.

### Files Likely Involved

- `apps/web/src/app/(app)/analysis/new/page.tsx`
- `apps/web/src/modules/analysis-workbench/components/`
- `apps/web/src/modules/analysis-workbench/actions/`
- `apps/web/src/core/validation/analyze.ts`
- `apps/web/src/modules/career-dashboard/components/`

### Dependencies

- Ticket ATLAS-004.
- Ticket ATLAS-006.

### Blockers

- None after API and extraction flow are available.

### Human Review

Optional. Recommended for form flow and demo ergonomics.

## Ticket ATLAS-008: Readiness Report and Markdown Export

Type: `AFK`

### Goal

Render a saved readiness report as a scannable dashboard and support Markdown export/copy.

### Expected Output

- `/reports/[id]` is protected.
- Report detail page verifies ownership.
- Dashboard shows target role, fit score, summary, role requirements, strengths, gaps, resume suggestions, source titles, and disclaimer.
- Markdown export/copy includes all core sections.
- Empty/error states are handled.

### Files Likely Involved

- `apps/web/src/app/(app)/reports/[id]/page.tsx`
- `apps/web/src/modules/readiness-report/components/readiness-dashboard.tsx`
- `apps/web/src/modules/readiness-report/components/report-section.tsx`
- `apps/web/src/modules/readiness-report/export/markdown.ts`
- `apps/web/src/modules/reports/queries/`
- `apps/web/src/modules/reports/types/`

### Dependencies

- Ticket ATLAS-006.

### Blockers

- Report JSON schema must be stable enough for rendering.

### Human Review

Required for dashboard clarity and whether the report looks portfolio-ready for demo.

## Ticket ATLAS-009: Roadmap Quests, Progress, and Milestone Badges

Type: `AFK`

### Goal

Implement the gamified roadmap quest UI and progress persistence for each saved report.

### Expected Output

- Report page groups quests into 30/60/90-day phases.
- User can mark quests complete or incomplete.
- Completion persists after refresh.
- Progress bar updates.
- Next best quest updates.
- Milestone badges are computed from completed quest categories.
- Cross-user updates are blocked.

### Files Likely Involved

- `apps/web/src/modules/roadmap/components/roadmap-timeline.tsx`
- `apps/web/src/modules/roadmap/components/quest-progress.tsx`
- `apps/web/src/modules/roadmap/components/milestone-badges.tsx`
- `apps/web/src/modules/roadmap/types/`
- `apps/web/src/app/api/reports/[id]/quests/[questId]/route.ts`
- `apps/web/src/core/validation/quest-progress.ts`
- `apps/web/src/core/validation/quest-progress.test.ts`
- `supabase/migrations/001_profiles_and_reports.sql`

### Dependencies

- Ticket ATLAS-006.
- Ticket ATLAS-008.

### Blockers

- Roadmap quest schema must include stable `questId` and category values.

### Human Review

Optional. Recommended to confirm the gamification feels professional and not childish.

## Ticket ATLAS-010: Ask Atlas Follow-Up Chat

Type: `AFK`

### Goal

Implement report-specific Ask Atlas follow-up chat after a report exists.

### Expected Output

- Ask Atlas is disabled or hidden before a report exists.
- User can ask one question at a time on a saved report.
- API verifies report ownership.
- Answer uses report JSON, structured resume evidence, quest progress, job summary, and RAG context.
- User and assistant messages are saved under the report.
- No streaming is required in v1.

### Files Likely Involved

- `apps/web/src/app/api/ask/route.ts`
- `apps/web/src/core/validation/ask.ts`
- `apps/web/src/core/ai/prompts.ts`
- `apps/web/src/core/ai/schemas.ts`
- `apps/web/src/modules/ask-atlas/components/ask-atlas-panel.tsx`
- `apps/web/src/modules/ask-atlas/actions/`
- `apps/web/src/modules/ask-atlas/schemas/`
- `apps/web/src/modules/readiness-report/components/readiness-dashboard.tsx`

### Dependencies

- Ticket ATLAS-006.
- Ticket ATLAS-008.
- Ticket ATLAS-009.

### Blockers

- OpenAI key must be configured.

### Human Review

Required for answer quality and privacy expectations.

## Ticket ATLAS-011: Automated Tests and CI

Type: `AFK`

### Goal

Add meaningful automated checks for the MVP and configure GitHub Actions.

### Expected Output

- Web lint/build/test commands run in CI.
- Python document-service tests run in CI.
- RAG tests run in CI where practical.
- Secrets scan is included.
- Tests cover validation, AI schema parsing, RAG chunking, document file validation, report ownership, and quest progress authorization.

### Files Likely Involved

- `.github/workflows/ci.yml`
- `apps/web/src/core/validation/*.test.ts`
- `apps/web/src/core/ai/*.test.ts`
- `apps/web/src/modules/**/*.test.tsx`
- `services/knowledge/document-service/tests/`
- `services/knowledge/rag/tests/`
- `package.json`
- `apps/web/package.json`

### Dependencies

- Ticket ATLAS-004.
- Ticket ATLAS-005.
- Ticket ATLAS-006.
- Ticket ATLAS-009.
- Ticket ATLAS-010.

### Blockers

- Dependency installation must be stable enough for CI.

### Human Review

Optional. Required only if CI runtime is too slow or flaky and scope needs adjustment.

## Ticket ATLAS-012: Deployment and Environment Configuration

Type: `HITL`

### Goal

Deploy the Atlas MVP to live URLs and configure production environment variables.

### Expected Output

- Web app deployed to Vercel.
- Document service deployed to Render or Railway.
- Supabase project configured with migrations.
- RAG seed data loaded.
- Production environment variables set securely.
- Live app works in incognito.
- Smoke test passes: sign in, upload resume, extract, analyze, view report, complete a quest, ask Ask Atlas.

### Files Likely Involved

- `README.md`
- `.env.example`
- `apps/web/`
- `services/knowledge/document-service/render.yaml` or equivalent deployment config
- `docs/deployment/infrastructure.md`
- `docs/deployment/production.md`
- `.github/workflows/ci.yml`

### Dependencies

- Ticket ATLAS-011.

### Blockers

- Vercel account/project access.
- Supabase project access.
- Render/Railway project access.
- OpenAI API key from the course environment.

### Human Review

Required. Human must configure secrets, verify live URL, and approve deployment settings.

## Ticket ATLAS-013: Submission Package, Demo, and Reflection

Type: `HITL`

### Goal

Prepare the graded submission package with links, README updates, demo recording, and reflection.

### Expected Output

- README includes live URL, setup instructions, model/provider notes, and privacy notes.
- Demo recording shows the core AI feature in under 2 minutes.
- Reflection write-up is complete.
- Submission checklist includes GitHub repo, live URL, demo video, validation report, PRD, spec, architecture notes, and CI evidence.
- No secrets are exposed in docs, repo, screenshots, or demo.

### Files Likely Involved

- `README.md`
- `docs/reflection.md`
- `docs/product/idea-validation.md`
- `docs/product/prd.md`
- `spec.md`
- `docs/deployment/production.md`
- `docs/README.md`

### Dependencies

- Ticket ATLAS-012.

### Blockers

- Live app must be deployed.
- GitHub repository must be public or accessible as required by the course.
- Demo recording tool/access must be available.

### Human Review

Required. Human must record the demo, confirm academic integrity, and submit final links.

## Suggested Build Order

1. ATLAS-001: Public Site and Brand Shell
2. ATLAS-002: Supabase Auth, Schema, and RLS Foundation
3. ATLAS-003: Career Dashboard Shell
4. ATLAS-004: Document Service and Resume Extraction Flow
5. ATLAS-005: Curated Career Guidance RAG Ingestion
6. ATLAS-006: Analysis API, AI Schemas, and Prompting
7. ATLAS-007: Analysis Workbench UI
8. ATLAS-008: Readiness Report and Markdown Export
9. ATLAS-009: Roadmap Quests, Progress, and Milestone Badges
10. ATLAS-010: Ask Atlas Follow-Up Chat
11. ATLAS-011: Automated Tests and CI
12. ATLAS-012: Deployment and Environment Configuration
13. ATLAS-013: Submission Package, Demo, and Reflection
