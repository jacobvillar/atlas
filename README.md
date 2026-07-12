# Atlas

Map your next career move.

Atlas is an AI-powered career readiness web application for fresh graduates, early-career professionals, and career shifters. Users sign in, upload a resume, paste a target job description, and receive a structured role-fit report with resume suggestions, RAG-grounded guidance, and personalized 30/60/90-day roadmap quests.

## MVP

- Supabase authentication before analysis
- PDF/DOCX resume upload
- Python FastAPI document service using Docling for extraction
- Extracted resume text review before analysis
- Target job description text input
- Curated career guidance RAG using Supabase `pgvector`
- OpenAI `gpt-4o-mini` for report generation and Ask Atlas
- OpenAI `text-embedding-3-small` for embeddings
- Saved reports and Ask Atlas messages
- Roadmap quest progress for each saved report
- Markdown export/copy for generated reports

## Architecture

```text
apps/web                         # Next.js app deployed to Vercel
services/knowledge/document-service
                                 # FastAPI + Docling runtime extraction
services/knowledge/rag           # Markdown seed docs + embedding loader
supabase/migrations              # Auth-owned tables, RLS, pgvector search
docs                             # Product, architecture, and delivery docs
```

## Planned Stack

- Web: Next.js, TypeScript, Tailwind CSS
- Auth/DB/vector store: Supabase Auth, Postgres, `pgvector`
- AI: OpenAI `gpt-4o-mini`
- Embeddings: OpenAI `text-embedding-3-small`
- Document processing: FastAPI + Docling
- Deployment: Vercel for web, Render or Railway for document service
- CI/CD: GitHub Actions

## Privacy Notes

Atlas handles sensitive career materials. Version 1 does not store uploaded resume files or full raw resume text. The app stores resume metadata, generated reports, Ask Atlas messages, and curated public/user-authored career guidance chunks for RAG.

## Documentation

- [Documentation Index](docs/index.md)
- [Idea Validation Report](docs/product/idea-validation.md)
- [Product Requirements Document](docs/product/prd.md)
- [Gamification Strategy](docs/product/gamification-strategy.md)
- [Spec](spec.md)
- [Project Plan](docs/architecture/project-plan.md)
- [Implementation Plan](docs/superpowers/plans/2026-07-12-atlas-mvp.md)
- [Folder Structure](docs/architecture/folder-structure.md)
- [Data Model](docs/architecture/data-model.md)
- [RAG Integration](docs/integrations/rag.md)
- [Document Service Integration](docs/integrations/document-service.md)
