# Project Plan

## Phase 1: Product and Architecture

- Finalize 7-step validation.
- Finalize PRD.
- Finalize `spec.md`.
- Finalize architecture notes for auth, data model, APIs, RAG, and document processing.

## Phase 2: Foundation

- Scaffold monorepo folders.
- Scaffold Next.js web app under `apps/web`.
- Scaffold web product modules under `apps/web/src/modules`.
- Add the initial public site pages: Home, Use Cases, Privacy, FAQ, and About.
- Scaffold FastAPI PDF/DOCX extraction service under `services/knowledge/document-service`.
- Scaffold RAG ingestion workspace under `services/knowledge/rag`.
- Add Supabase migrations for auth-owned data and vector resources.

## Phase 3: Core User Flow

- Implement Supabase Auth.
- Implement public navigation with Home, Use Cases, Privacy, FAQ, About, Login, and Sign up for free.
- Implement protected career dashboard.
- Implement resume upload and extraction through the document service.
- Implement authenticated `POST /api/extract-resume` as the web proxy to the document service.
- Implement extracted text review.
- Implement job description input.
- Implement runtime RAG retrieval in the web app.
- Implement career report generation with OpenAI and retrieved RAG context.
- Persist report metadata and report JSON.
- Persist structured resume evidence for saved Ask Atlas context.
- Persist generated roadmap quest progress.
- Implement quest completion toggles for saved reports.

## Phase 4: Ask Atlas

- Implement Ask Atlas panel after report generation.
- Retrieve report context, structured resume evidence, quest progress, and RAG chunks.
- Generate simple request/response answers with `gpt-4o-mini`.
- Save user and assistant messages.

## Phase 5: Quality and Deployment

- Add unit tests for validation, schemas, prompt construction, and RAG helpers.
- Add Python tests for file validation and extraction wrapper.
- Add GitHub Actions for lint/tests/secrets scan.
- Deploy web app to Vercel.
- Deploy document service to Render or Railway.
- Configure Supabase and environment variables.
- Record demo and write reflection.

## Remaining Decisions

- Choose final deployment host for the Python document service: Render or Railway.
- Select and cite the first public career guidance resources for the RAG seed set.
- Define the privacy guardrails, user-feedback signals, and success criteria for the v2 adaptive recommendation engine.
