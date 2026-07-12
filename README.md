# Atlas

**Gamified Career Coach, Roadmap, and Tracker**

Atlas turns career preparation into an adventure: you level up in real life, build real skills, grow your professional "aura" (presence and reputation), and evolve with every quest you complete. Under the hood it compares your resume against a target role, produces a grounded readiness report, and turns the gaps into a personalized quest roadmap you can play through.

We aren't another complicated career-advice tool. Users answer a few career questions (or paste a job description), receive a readiness report plus a personalized quest roadmap, and then complete quests and earn rewards as they level up toward their target role.

**Tagline:** Map your next career move.

**v1 scope:** Atlas accepts any pasted job description. Initial career-path presets, example content, and curated guidance focus on AI, data, and adjacent early-career roles; the analysis flow does not reject another target role.

## How to Use Atlas

1. **Answer a few career questions** to build your plan — current role, target role, and any references from a target job description.
2. **Get your custom career plan** — a readiness report plus a personalized quest roadmap.
3. **Complete quests and earn rewards** as you level up toward your dream role.

---

## What It Does

### For Job Seekers

- **Upload a resume** -> Extract and review content from PDF/DOCX files
- **Set a target role** -> Compare resume evidence against a pasted job description, or choose a target career path
- **Review readiness** -> See fit score, strengths, gaps, and role requirements
- **Play the roadmap** -> Complete practical 30/60/90-day quests, earn XP, and level up your readiness rank
- **Track progress** -> Surface "today's quests" from the roadmap, earn rewards, and collect milestone badges
- **Ask Atlas** -> Ask follow-up questions about the saved report

Progression mechanics (XP, readiness levels, rewards, and aura) are in-app recognition of real effort only. They never imply guaranteed interviews, offers, or hiring outcomes, and the fit score stays guidance, not a hiring prediction.

### For a Capstone MVP

- **Product validation** -> 7-step validation, PRD, and architecture notes
- **Document processing** -> Runtime PDF/DOCX extraction with Docling
- **RAG practice** -> Curated career guidance indexed with embeddings
- **AI engineering** -> Structured prompting, schema validation, and privacy boundaries
- **Deployment path** -> Vercel web app, Supabase backend, and Render/Railway document service

---

## Core Capabilities

| Capability | Description |
| --- | --- |
| **Resume Extraction** | Extract text from PDF/DOCX resumes through a private FastAPI + Docling service |
| **Role-Fit Analysis** | Compare reviewed resume text against a pasted job description |
| **Readiness Dashboard** | Render fit score, strengths, gaps, role requirements, and priority actions |
| **Resume Suggestions** | Suggest stronger bullets and missing evidence the user can verify |
| **Roadmap Quests** | Generate a 30/60/90-day quest roadmap with a "today's quests" view surfaced on top |
| **Gamified Progression** | Award XP, readiness levels/ranks, rewards, and milestone badges as quests complete |
| **Ask Atlas** | Report-specific follow-up chat using saved report context and RAG guidance |
| **Curated RAG** | Retrieve trusted resume, portfolio, interview, and early-career guidance chunks |
| **Markdown Export** | Copy or export generated reports for portfolio and submission use |

---

## High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
├─────────────┬─────────────┬─────────────┬─────────────┬────────┤
│    core     │   modules   │   modules   │   modules   │   ui   │
│  ─────────  │  ─────────  │  ─────────  │  ─────────  │────────│
│  Auth       │ Public Site │ Analysis    │ Reports     │ Shared │
│  Supabase   │ Dashboard   │ Workbench   │ Roadmap     │ Forms  │
│  AI Gateway │             │ Ask Atlas   │ Export      │ Panels │
│  RAG        │             │             │             │        │
└─────────────┴─────────────┴─────────────┴─────────────┴────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER ROUTES                      │
├─────────────┬─────────────┬─────────────┬─────────────┬────────┤
│ extract-    │ analyze     │ ask         │ reports     │ quests │
│ resume      │             │             │             │        │
└─────────────┴─────────────┴─────────────┴─────────────┴────────┘
             │                    │
             ▼                    ▼
┌─────────────────────────────┐   ┌───────────────────────────────┐
│ FASTAPI DOCUMENT SERVICE    │   │ SUPABASE                      │
│ Docling PDF/DOCX extraction │   │ Auth, Postgres, RLS, pgvector │
└─────────────────────────────┘   └───────────────────────────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ OPENAI               │
                           │ gpt-4o-mini          │
                           │ text-embedding-3-small│
                           └──────────────────────┘
```

### Runtime Flow

```text
Signed-in user
-> uploads resume to Next.js
-> Next.js proxies file to FastAPI document service
-> user reviews extracted text
-> Next.js retrieves career guidance chunks from Supabase pgvector
-> OpenAI generates structured report JSON
-> Supabase stores report, structured resume evidence, quest progress, and Ask Atlas messages
```

### Offline RAG Flow

```text
Markdown career guidance seed docs
-> chunk and embed with text-embedding-3-small
-> upsert into Supabase career_resource_chunks
-> retrieve at runtime through apps/web/src/core/rag
```

---

## Supabase

Atlas uses Supabase as the main backend platform:

| Area | Supabase Role |
| --- | --- |
| **Auth** | Sign-up, login, sessions, and protected routes |
| **Postgres** | Stores resume metadata, reports, quests, and Ask Atlas messages |
| **RLS** | Ensures users can access only their own reports and messages |
| **pgvector** | Stores curated career guidance embeddings for RAG |
| **Migrations** | Keeps schema, policies, and vector functions versioned in code |

Core tables (identity lives in `auth.users`; no `profiles` table in v1):

- `resume_documents`
- `career_reports`
- `roadmap_quest_progress`
- `ask_atlas_messages`
- `career_resource_chunks`

Privacy boundary: Atlas v1 does not store uploaded resume files or full raw resume text. It stores resume metadata, structured resume evidence, generated reports, roadmap progress, and report-specific chat messages. No extracted text preview is stored.

---

## Modular Monolith

Atlas uses a **modular monolith** architecture: one deployable web app with clear module boundaries.

- **`core`** -> Auth helpers, Supabase clients, AI gateway, RAG retrieval, validation
- **`modules`** -> Product workflows such as public site, dashboard, analysis, reports, roadmap, and Ask Atlas
- **`components/ui`** -> Shared UI primitives
- **`services/knowledge/document-service`** -> Separate Python service for runtime document extraction
- **`services/knowledge/rag`** -> Offline/admin ingestion for curated career guidance
- **`supabase/migrations`** -> Database schema, RLS policies, and vector search functions

This keeps the MVP simpler than microservices while still making the codebase easy to navigate, test, and extend.

---

## AI Strategy

| Use Case | Model / Tool | Notes |
| --- | --- | --- |
| Resume/job analysis | `gpt-4o-mini` | Generates structured readiness report JSON |
| Ask Atlas | `gpt-4o-mini` | Answers report-specific follow-up questions |
| Career guidance embeddings | `text-embedding-3-small` | Embeds curated Markdown guidance |
| Resume extraction | Docling | Converts PDF/DOCX resumes into reviewable text |
| Vector retrieval | Supabase `pgvector` | Retrieves relevant career guidance chunks |

AI guardrails:

- Validate user inputs before model calls
- Validate AI output before rendering or saving
- Treat resumes and job descriptions as data, not instructions
- Keep OpenAI keys server-side only
- Do not embed private resumes into the shared RAG knowledge base
- Present fit score as guidance, not a hiring prediction

---

## Tech Stack

### Frontend

- **Next.js** + **TypeScript**
- **Tailwind CSS**
- **Supabase Auth**

### Backend

- **Supabase** — PostgreSQL, Row Level Security, `pgvector`
- **Next.js Route Handlers** — Auth-aware server routes
- **FastAPI + Docling** — PDF/DOCX resume extraction

### AI

- **OpenAI `gpt-4o-mini`** — Report generation and Ask Atlas
- **OpenAI `text-embedding-3-small`** — RAG embeddings

### Deployment

- **Vercel** — Web app
- **Render or Railway** — Document service
- **Supabase Cloud** — Auth, database, and vector store
- **GitHub Actions** — CI checks

---

## Project Structure

```text
atlas/
├── apps/web/                         # Next.js app
│   └── src/
│       ├── app/                      # Routes and API routes
│       ├── core/                     # Auth, Supabase, AI, RAG, validation
│       ├── modules/                  # Product workflow modules
│       └── components/ui/            # Shared UI primitives
├── services/knowledge/
│   ├── document-service/             # FastAPI + Docling extraction
│   └── rag/                          # Markdown seed docs + ingestion
├── supabase/migrations/              # Schema, RLS, pgvector
├── docs/                             # Product, architecture, delivery docs
├── spec.md                           # MVP specification
└── CLAUDE.md                         # Agent operating rules
```

---

## Documentation

- [Documentation Index](docs/index.md)
- [Idea Validation Report](docs/product/idea-validation.md)
- [Product Requirements Document](docs/product/prd.md)
- [Spec](spec.md)
- [Pre-Implementation Architecture Review](docs/architecture/pre-implementation-review.md)
- [Project Plan](docs/architecture/project-plan.md)
- [Implementation Plan](docs/superpowers/plans/2026-07-12-atlas-mvp.md)
- [MVP Tickets](docs/superpowers/tickets/atlas-mvp-tickets.md)
- [Data Model](docs/architecture/data-model.md)
- [RAG Integration](docs/integrations/rag.md)
- [Document Service Integration](docs/integrations/document-service.md)
