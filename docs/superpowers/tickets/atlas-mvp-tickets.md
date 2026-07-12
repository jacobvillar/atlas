# Atlas MVP Tickets

These tickets break the Atlas MVP into vertical slices that can be picked up by coding agents or a human developer. Each ticket should produce a usable, testable increment.

Direction: Atlas is a gamified career coach, roadmap, and tracker that turns career readiness into an adventure — users complete quests, earn XP, and level up their readiness rank. v1 is themed around AI/ML engineering readiness (AI Engineer, ML Engineer, LLM/Applied-AI Engineer, MLOps Engineer); the analysis engine stays general (SOFT scope — accepts any resume + JD), while curated RAG content, career-path presets, example copy, and the capstone demo center on AI engineering. Broad job market is v2. Hype framing ("level up IRL," "aura," "evolve") lives in landing, onboarding, and the quest board; the readiness report itself stays calm and credible. Non-negotiables hold: Supabase auth required before analysis; no uploaded resume files or full raw resume text stored; fit score is guidance, not a hiring prediction; XP/levels/rewards are in-app progression only and never imply guaranteed interviews, offers, or hiring outcomes.

Status note: ATLAS-001 through ATLAS-006 are implemented in code, with two carve-outs. (1) 006 covers **pasted-job-description mode with a non-XP report schema only**; career-path synthesis is ATLAS-006A and the XP/levels model is ATLAS-009A. (2) **ATLAS-004's web half was never built** — the Python document service exists and is tested, but the `/api/extract-resume` web proxy and upload/review UI do not; that gap is folded into ATLAS-007 (upload is fail-soft: paste always works even if the document service is not configured).

Architecture decisions (locked): XP is server-assigned by phase (30→50, 60→75, 90→100), never model-generated. Per-report progression computed on read; level = percent of the report's total XP (0/25/50/75/100% → Base Camp, Explorer, Pathfinder, Trailblazer, Summit Ready). Badges earned when all quests in a category complete (resume→Resume Ready, skills→Skill Builder, projects→Proof Added, networking→Outreach Ready, interview→Interview Ready). `report_json` gains `inputMode` ("job_description" | "career_path") — jsonb, no migration. Old pre-XP reports render with missing xp as 0.

Revision note (this pass): added ATLAS-006A and ATLAS-009A; corrected the completeness claim above; reordered so the analysis output shape is finalized before any report-render UI; added a "Review: Gaps, Assumptions, and Agent Safety" section at the end.

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
- Core tables exist: `resume_documents`, `career_reports`, `roadmap_quest_progress`, `ask_atlas_messages`, and `career_resource_chunks`. No `profiles` table in v1; `auth.users` covers identity.
- RLS prevents cross-user access.
- Supabase browser and server clients are available to the web app.

### Files Likely Involved

- `supabase/migrations/001_reports.sql`
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
- Dashboard has placeholders for recent reports, a "today's quests" preview, roadmap progress, XP and readiness level/rank, and milestone badges within the leveling system.
- Progression framing (XP, level/rank, "today's quests," aura flourishes) may use adventure-style copy here; the report itself stays credible.
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
- Resume metadata (file name, type, status) is saved under the authenticated user; no extracted text preview is stored.

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

- Seed Markdown files exist for resume writing, STAR/interview answers, portfolio/project advice, early-career job search, and a bootcamp/career note, curated for AI-engineering readiness (AI Engineer, ML Engineer, LLM/Applied-AI Engineer, MLOps Engineer).
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

Implement the server-side analysis flow that turns reviewed resume text and a target job description into a validated readiness report with roadmap quests. Two input modes feed one pipeline, job description primary: a pasted job description, or a chosen/entered target role (career-path mode) that Atlas synthesizes into a representative role profile stored in `career_reports.job_description_text` (NOT NULL). No schema change is required for career-path mode.

### Expected Output

- `POST /api/analyze` requires authentication.
- Inputs are validated before AI calls.
- Career-path mode synthesizes a role profile into `jobDescriptionText` before the shared pipeline runs; the downstream flow is identical for both modes.
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

## Ticket ATLAS-006A: Career-Path Role-Profile Synthesis

Type: `HITL`

### Goal

Add the AI step that turns a chosen/entered target role (career-path mode) into a synthesized, representative role profile, so users without a specific job posting can still run an analysis. ATLAS-006 is implemented for pasted-JD mode only; this ticket adds the missing synthesis that feeds the same `/api/analyze` pipeline.

### Expected Output

- A `synthesizeRoleProfile(targetRole)` function in `core/ai` returns a representative requirements profile for the role, validated against a schema before use.
- `/api/analyze` accepts a career-path request (target role, no pasted JD); the server synthesizes a role profile, stores it in `career_reports.job_description_text` (NOT NULL, unchanged), then runs the identical downstream flow.
- Synthesis is themed to AI-engineering roles in v1 (AI Engineer, ML Engineer, LLM/Applied-AI Engineer, MLOps) but the function stays role-general (soft scope).
- Reports generated from career-path mode are labeled "based on a typical [role] profile" so users know it is not a specific posting.
- The treat-input-as-data / prompt-injection guards from ATLAS-006 apply to the target-role input; empty/oversized role inputs are rejected before the AI call.

### Files Likely Involved

- `apps/web/src/core/ai/prompts.ts`
- `apps/web/src/core/ai/schemas.ts`
- `apps/web/src/core/ai/openai.ts`
- `apps/web/src/core/validation/analyze.ts`
- `apps/web/src/app/api/analyze/route.ts`
- `apps/web/src/core/ai/*.test.ts`

### Dependencies

- Ticket ATLAS-006.

### Blockers

- OpenAI API key must be configured.
- Synthesized-profile quality may need prompt iteration against real AI-engineering roles.

### Human Review

Required. Confirm synthesized profiles are realistic and clearly labeled as generic, not a real posting.

## Ticket ATLAS-007: Analysis Workbench UI

Type: `AFK`

### Goal

Build the guided UI for one complete analysis: resume review, job description input, target role, and generate report action.

### Status (this pass)

**JD-mode shipped.** Implemented: `/analysis/new` (protected, defense-in-depth auth check), the resume/job-description/target-role form with client-side validation mirroring `core/validation/analyze.ts` bounds, and the previously-missing web half of ATLAS-004 — the `/api/extract-resume` proxy plus an optional PDF/DOCX upload control that fills the resume textarea for user review before submit.

- `/api/extract-resume` is an authenticated route that validates file type/size, forwards the upload to the Python document service (`${DOCUMENT_SERVICE_URL}/extract-resume`, `x-api-key` header when `DOCUMENT_SERVICE_API_KEY` is set), and inserts a `resume_documents` metadata row (file name, file type, `extraction_status: "completed"`) for the authenticated user. It never stores or logs extracted text or file contents. Returns `503 { error: "Document service not configured" }` when `DOCUMENT_SERVICE_URL` is unset.
- Upload is **fail-soft by design**: any client-side validation failure (wrong extension, >5MB), non-2xx from the proxy, missing extracted text, or a network error surfaces "Upload unavailable — paste your resume instead" and leaves the paste textarea fully usable. Paste remains the primary, always-available path.
- Generate submits JSON to the existing `/api/analyze`; success navigates to `/reports/[reportId]` (that page 404s until ATLAS-008 — expected).

**Career-path mode is deferred.** The role-only input mode (no separate JD paste, AI-engineering presets) described below is out of scope for this pass and lands after ATLAS-006A ships `synthesizeRoleProfile`; there is no mode toggle in the UI yet, and the JD field is currently required.

### Expected Output

- `/analysis/new` is protected.
- User can review extracted resume text.
- Two input modes: paste a target job description (primary), or choose/enter a target role in career-path mode. AI-engineering roles are offered as presets in v1.
- Career-path mode requires no separate JD paste; the synthesized role profile flows into the same `/api/analyze` pipeline.
- Validation errors are clear.
- Generate button calls `/api/analyze`.
- Successful analysis navigates to the saved report detail page.

### Files Likely Involved

- `apps/web/src/app/(app)/analysis/new/page.tsx`
- `apps/web/src/modules/analysis-workbench/components/`
- `apps/web/src/modules/analysis-workbench/actions/`
- `apps/web/src/core/validation/analyze.ts`
- `apps/web/src/modules/career-dashboard/components/`
- `apps/web/src/app/api/extract-resume/route.ts`

### Dependencies

- Ticket ATLAS-004.
- Ticket ATLAS-006.

### Blockers

- None after API and extraction flow are available.
- Career-path mode UI is blocked on ATLAS-006A's `synthesizeRoleProfile`.

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
- Report also surfaces readiness level/rank and XP earned so far, consistent with the dashboard.
- Career-path reports are labeled "based on a typical [role] profile."
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
- Ticket ATLAS-009A (report_json shape, including per-quest XP and readiness level, must be final before rendering).

### Blockers

- Report JSON schema must be finalized in ATLAS-009A before this ticket starts, so the render is not chasing a changing shape.

### Human Review

Required for dashboard clarity and whether the report looks portfolio-ready for demo.

## Ticket ATLAS-009A: Gamification Data Model and XP Scoring

Type: `HITL`

### Goal

Define and implement the XP/leveling data model that the ATLAS-009 UI renders. ATLAS-006's report schema currently carries no XP and there is no level computation; this ticket finalizes the progression shape before the report render (ATLAS-008) and quest UI (ATLAS-009) consume it.

Open decision (human): is progression scoped per-report (each report has its own XP/level) or per-user (a global career rank across all reports)? Recommended MVP: **per-report, computed on read** — no migration needed. A global career rank is a v2 candidate.

### Expected Output

- ATLAS-006 report schema is amended so each roadmap quest carries a stable `xp` value; `questId` and `category` stay stable.
- A pure `levels` module computes readiness level/rank and `xpTotal` from completed quests, with deterministic thresholds and unit tests.
- Per-report progression (XP total, level/rank) is computed on read by summing XP of completed quests joined from `roadmap_quest_progress`. No schema migration is required for the per-report design; a migration is needed only if a persisted per-user career rank is chosen.
- A fixed milestone badge → quest-category mapping is defined so badges are deterministic (resolves the mismatch between the badge names in the ATLAS-003 shell and the schema categories).
- Ethics preserved: XP/levels/rewards are in-app progression only and never imply guaranteed interviews, offers, or hiring outcomes.

### Files Likely Involved

- `apps/web/src/core/ai/schemas.ts`
- `apps/web/src/core/ai/report.ts`
- `apps/web/src/core/gamification/levels.ts`
- `apps/web/src/core/gamification/levels.test.ts`
- `apps/web/src/modules/roadmap/types/`
- `supabase/migrations/003_progression.sql` (only if per-user rank is chosen)

### Dependencies

- Ticket ATLAS-006.

### Blockers

- Human decision on per-report vs per-user progression scope must be made before implementation.

### Human Review

Required. Approve the progression-scope decision and confirm level thresholds feel meaningful (not trivially maxed, not grindy).

## Ticket ATLAS-009: Roadmap Quests, XP, Levels, and Milestone Badges

Type: `AFK`

### Goal

Implement the gamified quest system, XP/leveling progression, and progress persistence for each saved report. The 30/60/90-day roadmap is the backbone; a "today's quests" view surfaces the next actionable quests on top of it so preparation feels like a daily adventure.

### Expected Output

- Report page groups quests into 30/60/90-day phases (the roadmap backbone).
- A "today's quests" view pulls the next actionable quests forward from the roadmap.
- User can mark quests complete or incomplete.
- Completing a quest awards XP; accumulated XP drives a readiness level/rank that rises as the user progresses ("evolve," level up).
- Rewards for completing quests and hitting milestones are in-app progression only (XP, rank-ups, badges, cosmetic/aura flourishes).
- Completion persists after refresh.
- Progress bar, XP total, and readiness level/rank update.
- Next best quest updates.
- Milestone badges are computed from completed quest categories (using the fixed mapping from ATLAS-009A) and are framed within the leveling system.
- The ATLAS-003 dashboard placeholders (today's quests, XP, readiness level/rank, milestone badges) become live and data-driven.
- Cross-user updates are blocked.
- Out of scope for v1: leaderboards, competitive leagues, ranking users against each other, social/public sharing of career data, and streak-loss or countdown-pressure mechanics.
- Quest and progression copy never implies that completing quests guarantees interviews, offers, or hiring outcomes.

### Files Likely Involved

- `apps/web/src/modules/roadmap/components/roadmap-timeline.tsx`
- `apps/web/src/modules/roadmap/components/quest-progress.tsx`
- `apps/web/src/modules/roadmap/components/milestone-badges.tsx`
- `apps/web/src/modules/roadmap/types/`
- `apps/web/src/app/api/reports/[id]/quests/[questId]/route.ts`
- `apps/web/src/core/validation/quest-progress.ts`
- `apps/web/src/core/validation/quest-progress.test.ts`
- `supabase/migrations/001_reports.sql`

### Dependencies

- Ticket ATLAS-009A (quest `xp`, level thresholds, and badge mapping finalized).
- Ticket ATLAS-008 (report page hosts the quest UI).

### Blockers

- Roadmap quest schema must include stable `questId`, `category`, and `xp` values (finalized in ATLAS-009A).

### Human Review

Optional. Recommended to confirm the gamification is motivating without overpromising: adventure framing on the quest board is fine, but the report stays credible and no copy implies guaranteed hiring outcomes.

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

1. ATLAS-001: Public Site and Brand Shell — done
2. ATLAS-002: Supabase Auth, Schema, and RLS Foundation — done
3. ATLAS-003: Career Dashboard Shell — done (placeholders; made live in ATLAS-009)
4. ATLAS-004: Document Service and Resume Extraction Flow — done
5. ATLAS-005: Curated Career Guidance RAG Ingestion — done (tooling; live seed load in ATLAS-012)
6. ATLAS-006: Analysis API, AI Schemas, and Prompting — done (JD mode, non-XP schema)
7. **ATLAS-006A: Career-Path Role-Profile Synthesis**
8. **ATLAS-009A: Gamification Data Model and XP Scoring** ← finalizes report/progression shape
9. ATLAS-007: Analysis Workbench UI
10. ATLAS-008: Readiness Report and Markdown Export
11. ATLAS-009: Roadmap Quests, XP, Levels, and Milestone Badges (UI + dashboard wiring)
12. ATLAS-010: Ask Atlas Follow-Up Chat
13. ATLAS-011: Automated Tests and CI
14. ATLAS-012: Deployment and Environment Configuration
15. ATLAS-013: Submission Package, Demo, and Reflection

Order rationale: ATLAS-006A and ATLAS-009A both finalize the analysis output shape (career-path input + per-quest XP + level fields) **before** any report-render UI. Building 007/008/009 against a settled `report_json` avoids reworking the render when the schema changes. 006A and 009A are independent of each other and can run in parallel.

## Review: Gaps, Assumptions, and Agent Safety

### Missing steps found and added

- **Career-path synthesis (ATLAS-006A).** The pivot promised a "choose a target role" mode, but ATLAS-006 only implements pasted-JD. The synthesis step that turns a role into a JD-equivalent profile was unbuilt — now its own ticket.
- **Gamification data model / XP scoring (ATLAS-009A).** `spec.md` now specifies XP, readiness level, and per-quest XP, but ATLAS-006's report schema has none and no level computation exists. Split out so the data shape is finalized before UI consumes it.
- **Live RAG seed load.** ATLAS-005 built ingestion tooling but it has not run against the live DB, so runtime retrieval is unverified and reports currently return an empty `sources` list. Called out under ATLAS-012 and as a pre-demo check.
- **DB credential rotation.** A database password was exposed in chat earlier this project; rotate it before deployment (ATLAS-012 blocker).

### Weak assumptions caught

1. **"ATLAS-001–006 fully implemented" overstated completeness** — 006 lacks career-path mode and XP. Status note corrected.
2. **Progression scope was never decided** (per-report vs per-user). It changes storage. Flagged as a human decision in ATLAS-009A; recommended per-report, computed on read, no migration.
3. **Milestone badge names don't map to quest categories.** The ATLAS-003 shell used "Resume Ready / Proof Added / Gap Closed"; the schema categories are resume/skills/projects/networking/interview. Needs a fixed mapping — added to ATLAS-009A.
4. **"Today's quests" had no selection rule.** Recommend a simple deterministic rule (earliest incomplete phase, next N incomplete quests) — no ML, no scheduler.
5. **ATLAS-009 → ATLAS-008 dependency conflated data with UI.** Quest data needs only 006/009A; the quest UI is hosted on the report page, so its dependency on 008 is real. Now split: data (009A ← 006), UI (009 ← 008 + 009A).
6. **Report-schema stability.** 008 and 010 assumed a stable `report_json`, but XP changes it. Reordered so 009A lands first.

### Agent-safety decisions

- **Safe for an agent end-to-end (AFK), with normal review:** ATLAS-007 (workbench UI), ATLAS-008 (report render + markdown), ATLAS-009 (quest/XP UI + dashboard wiring), ATLAS-011 (tests/CI). These are bounded, schema-driven, and secret-free at the boundary (they call existing server routes).
- **Agent may implement, but a human must review before it ships (HITL):** ATLAS-006A (synthesized-profile realism + honest "typical profile" labeling), ATLAS-009A after the scope decision (schema/level design), ATLAS-010 (answer quality + privacy of report context).
- **Human decision required before an agent starts:** the ATLAS-009A per-report-vs-per-user progression scope.
- **Not agent-completable (human-owned):** ATLAS-012 (account access, secrets, live verification, credential rotation) and ATLAS-013 (human records the demo, confirms academic integrity, submits).
