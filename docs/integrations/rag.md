# RAG Integration

Atlas uses retrieval-augmented generation to ground career guidance in a small curated knowledge base. The RAG knowledge base is separate from private user resumes.

## Knowledge Base

Seed files live under:

```text
services/knowledge/rag/data/seed/
```

Minimum seed set:

- 2 resume-writing guides
- 1 STAR/interview answer guide
- 1 portfolio/project advice note
- 1 job-search or early-career advice guide
- 1 personal bootcamp/career note written in the project owner's own words

The seed files should be Markdown so they are easy to review, cite, version, and chunk.

## Ingestion Flow

```text
Markdown seed docs
-> loader reads files
-> parser extracts frontmatter/source metadata
-> chunker splits guidance into retrieval chunks
-> embedder creates text-embedding-3-small vectors
-> vectorstore upserts career_resource_chunks in Supabase
```

The ingestion script is an admin/offline workflow, not a user-facing API. Runtime retrieval is owned by the Next.js web app so auth, OpenAI usage, and report generation stay in one server-side request flow.

```text
services/knowledge/rag/scripts/load_career_resources.py
```

## Internal Structure

```text
services/knowledge/rag/
  app/
    config/
      settings.py
    embeddings/
      embedder.py
    ingestion/
      loader.py
      parser.py
      chunker.py
    vectorstore/
      supabase_vectorstore.py
  data/
    seed/
  scripts/
    load_career_resources.py
  tests/
```

This mirrors the useful ingestion parts of a conventional RAG project layout while keeping Atlas scoped to a curated career guidance knowledge base.

## Runtime Retrieval Flow

```text
resume text + job description + user question
-> apps/web/src/core/rag builds retrieval query
-> apps/web/src/core/rag embeds retrieval query
-> apps/web/src/core/rag calls match_career_resources RPC
-> apps/web/src/core/rag formats retrieved chunks for prompt context
-> apps/web/src/core/ai passes top chunks to gpt-4o-mini
```

Typical `match_count`: 4 to 6 chunks.

## Source Use

Atlas should include source titles in generated reports and Ask Atlas answers. It does not need formal academic citations in the app UI, but project documentation should list public sources used for seed content.

## Privacy Boundary

- User resumes are not inserted into `career_resource_chunks`.
- Private user documents are not embedded for long-term retrieval in v1.
- The RAG database contains only curated career guidance resources.

## Why No RAG API in v1

Atlas does not need public RAG endpoints such as document upload/delete in v1. The web app already owns the user-facing APIs, and the RAG content is seeded by the project owner. Keeping Python RAG as offline ingestion and Next.js as runtime retrieval reduces auth complexity and avoids accidentally treating private resumes as knowledge base documents.
