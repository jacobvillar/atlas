# Pre-Implementation Architecture Review

## Review Summary

Atlas is ready to move toward implementation after a few architecture corrections. The core product direction is sound: authenticated resume extraction, job-description comparison, RAG-grounded report generation, saved roadmap quests, and Ask Atlas.

The main risk before implementation was not product scope. It was ambiguous ownership between services and a privacy gap around saved Ask Atlas context.

## Changes Made Before Implementation

### 1. Saved Resume Context Without Raw Resume Storage

Problem: The plan said full raw resume text is not stored, but Ask Atlas still needed resume context after the report was saved.

Decision: Save `resume_evidence_json` on `career_reports`.

This stores normalized evidence such as skills, tools, education, experience themes, projects, and constraints. It does not store the full raw resume text or uploaded resume file.

Implementation impact:

- `POST /api/analyze` must produce and save `resume_evidence_json`.
- `POST /api/ask` must use `resume_evidence_json`, report JSON, quest progress, job context, and RAG chunks.
- Ask Atlas requests should not require `activeResumeText`.

### 2. Single Runtime RAG Owner

Problem: The plan had Python RAG retrieval helpers and Next.js `core/rag`, which could create two retrieval implementations.

Decision: Python RAG is offline/admin ingestion only. Runtime retrieval belongs to `apps/web/src/core/rag`.

Implementation impact:

- `services/knowledge/rag` loads seed Markdown, chunks, embeds, and upserts to Supabase.
- `apps/web/src/core/rag/retrieve.ts` embeds runtime queries, calls the Supabase RPC, and formats retrieved chunks for prompts.
- Do not create a Python RAG web server or user-facing RAG API in v1.

### 3. Explicit Document-Service Proxy

Problem: The document service is private, but the API surface did not explicitly include the web route that browser code should call.

Decision: Add authenticated `POST /api/extract-resume` in the Next.js app.

Implementation impact:

- Browser uploads to Next.js, not directly to the Python service.
- Next.js validates auth, file type, and file size.
- Next.js calls the document service with `DOCUMENT_SERVICE_API_KEY`.
- Only resume metadata and preview are saved.

### 4. One Roadmap Quest Source Of Truth

Problem: The spec listed both `roadmapQuests` and separate `roadmap30Days`, `roadmap60Days`, `roadmap90Days` outputs.

Decision: Use one `roadmapQuests` array with `phase`, `category`, and stable `questId`.

Implementation impact:

- UI groups quests by `phase`.
- Milestone badges are computed from quest categories and completion state.
- Quest progress rows reference `questId`.

### 5. Clearer Public/Auth Split

Problem: Public site and auth tickets both appeared to own login/signup pages.

Decision: Public site owns navigation and shell. Auth owns working Supabase forms.

Implementation impact:

- ATLAS-001 links to `/login` and `/signup`.
- ATLAS-002 implements working signup/login flows and protected route redirects.

## Blocking Items Before Coding

- Confirm email/password Supabase Auth is enough for v1.
- Select final public/open RAG seed sources and write the personal bootcamp/career note.
- Choose Render or Railway for the Python document service.

## Recommended Implementation Order

1. Public site shell and brand.
2. Supabase Auth, database schema, and RLS.
3. Dashboard shell.
4. Document extraction service plus `POST /api/extract-resume`.
5. RAG ingestion and seed loading.
6. Analysis API and structured AI schemas.
7. Analysis workbench UI.
8. Readiness report and roadmap quest UI.
9. Ask Atlas.
10. Tests, CI, deployment, and submission package.

## Do Not Start Implementation Until

- `resume_evidence_json` is included in the migration and AI schema.
- Runtime RAG retrieval is scoped to Next.js.
- The document service is only reachable from server-side web routes.
- Quest schema includes stable `questId`, `phase`, and `category`.
- The auth/public page split is understood by the implementing agent.
