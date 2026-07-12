# Folder Structure

Atlas uses a monorepo so the web app, document extraction service, RAG ingestion, Supabase schema, and docs are separated by responsibility.

```text
atlas/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── page.tsx
│           │   ├── use-cases/
│           │   ├── privacy/
│           │   ├── faq/
│           │   ├── about/
│           │   ├── (auth)/
│           │   │   ├── login/
│           │   │   └── signup/
│           │   ├── (app)/
│           │   │   ├── dashboard/
│           │   │   ├── analysis/new/
│           │   │   ├── reports/
│           │   │   └── reports/[id]/
│           │   ├── api/
│           │   │   ├── analyze/
│           │   │   │   └── route.ts
│           │   │   ├── ask/
│           │   │   │   └── route.ts
│           │   │   └── reports/
│           │   │       └── [id]/quests/[questId]/
│           │   ├── globals.css
│           │   └── layout.tsx
│           ├── components/
│           │   └── ui/
│           ├── core/
│           │   ├── ai/
│           │   ├── auth/
│           │   ├── rag/
│           │   ├── supabase/
│           │   └── validation/
│           ├── modules/
│           │   ├── public-site/
│           │   ├── auth/
│           │   ├── career-dashboard/
│           │   ├── analysis-workbench/
│           │   ├── readiness-report/
│           │   ├── roadmap/
│           │   ├── ask-atlas/
│           │   └── reports/
│           ├── lib/
│           └── tests/
├── services/
│   └── knowledge/
│       ├── document-service/
│       │   ├── app/
│       │   │   ├── main.py
│       │   │   ├── extraction.py
│       │   │   └── validation.py
│       │   ├── tests/
│       │   ├── requirements.txt
│       │   └── render.yaml
│       └── rag/
│           ├── data/
│           │   └── seed/
│           ├── app/
│           │   ├── config/
│           │   │   └── settings.py
│           │   ├── embeddings/
│           │   │   └── embedder.py
│           │   ├── ingestion/
│           │   │   ├── chunker.py
│           │   │   ├── loader.py
│           │   │   └── parser.py
│           │   └── vectorstore/
│           │       └── supabase_vectorstore.py
│           ├── scripts/
│           │   └── load_career_resources.py
│           ├── tests/
│           └── README.md
├── supabase/
│   └── migrations/
├── docs/
├── spec.md
└── CLAUDE.md
```

## Boundaries

- `apps/web` contains the user-facing app, API routes, auth-aware server logic, OpenAI calls, and Supabase reads/writes.
- `apps/web/src/modules` contains product workflow modules: public site, auth, career dashboard, analysis workbench, readiness report, roadmap, Ask Atlas, and saved reports.
- `apps/web/src/core` contains shared infrastructure code: auth helpers, Supabase clients, AI prompts/schemas, RAG retrieval, and validation.
- `apps/web/src/components/ui` contains shared UI primitives only.
- `services/knowledge/document-service` contains runtime resume extraction with FastAPI and Docling.
- `services/knowledge/rag` contains offline/admin ingestion helpers for curated career guidance resources.
- `supabase/migrations` contains database schema, RLS policies, and vector search functions.
- `docs` contains project deliverables, architecture notes, and implementation plans.

## RAG Service Scope

The RAG service borrows the useful ingestion structure of a standalone RAG project, but Atlas keeps runtime retrieval inside the Next.js web app rather than creating a second public API.

Included in v1:

- `ingestion/loader.py`: read curated Markdown seed files.
- `ingestion/parser.py`: parse frontmatter and source metadata.
- `ingestion/chunker.py`: split guidance into retrieval chunks.
- `embeddings/embedder.py`: create `text-embedding-3-small` vectors.
- `vectorstore/supabase_vectorstore.py`: upsert Supabase `pgvector` rows for curated guidance.
- `apps/web/src/core/rag/retrieve.ts`: runtime query embedding, Supabase RPC retrieval, and prompt context formatting.

Not included in v1:

- Public RAG document upload/delete APIs.
- User-managed knowledge base documents.
- Embedding private user resumes into the vector database.
- Separate RAG web server.
- A duplicate Python runtime retriever for user-facing analysis.

## Reference Alignment

This structure borrows the separation style from the reference codebase:

- `core` for shared app services.
- `modules` or domain folders for product workflows.
- `services` for deployable backend processes.
- `supabase` for schema and persistence.
- `docs` for product and architecture decisions.
