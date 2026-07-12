# Infrastructure

## Target Hosts

- Web app: Vercel
- Document service: Render or Railway
- Auth/database/vector store: Supabase
- Repository and CI: GitHub + GitHub Actions

## Services

- `apps/web`: Next.js app with protected career dashboard, API routes, OpenAI calls, RAG retrieval, and Supabase persistence.
- `services/knowledge/document-service`: Python FastAPI service with Docling for PDF/DOCX extraction.
- `services/knowledge/rag`: offline ingestion scripts for curated career guidance resources.
- `supabase`: schema, RLS policies, and vector search functions.

## Environment Variables

Web app:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
DOCUMENT_SERVICE_URL=
DOCUMENT_SERVICE_API_KEY=
```

Document service:

```text
DOCUMENT_SERVICE_API_KEY=
MAX_UPLOAD_MB=5
```

## Deployment Notes

- The live app must work in an incognito browser.
- Supabase RLS must be enabled before using the live app.
- RAG seed data must be loaded after migrations run.
- Document service health check should expose `GET /api/health`.
