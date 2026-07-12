# Getting Started

## Prerequisites

- Node.js 20 or newer
- npm
- Python 3.10 or newer for Docling
- Supabase project
- OpenAI API key from the course/Vocareum environment

## Local Setup

After implementation scaffolding:

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Document service:

```bash
cd services/knowledge/document-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

RAG ingestion:

```bash
cd services/knowledge/rag
python scripts/load_career_resources.py
```

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

Do not commit `.env.local` or service `.env` files.
