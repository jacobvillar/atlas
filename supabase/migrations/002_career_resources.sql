-- Curated career-guidance knowledge base for RAG.
-- Rows are written only by the offline ingestion script (service role). Authenticated
-- users read via the server-side match_career_resources RPC. Private resumes and job
-- descriptions are never stored here.

create extension if not exists vector;

create table career_resource_chunks (
  id text primary key,
  source_title text not null,
  source_url text,
  source_type text not null,
  chunk_text text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

alter table career_resource_chunks enable row level security;

-- Read-only to authenticated users; writes happen only via service-role ingestion.
create policy "career_resource_chunks_read_authenticated"
on career_resource_chunks
for select
to authenticated
using (true);

create or replace function match_career_resources(
  query_embedding vector(1536),
  match_count int default 6,
  min_similarity float default 0.2
)
returns table (
  id text,
  source_title text,
  source_url text,
  source_type text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_title,
    source_url,
    source_type,
    chunk_text,
    1 - (embedding <=> query_embedding) as similarity
  from career_resource_chunks
  where 1 - (embedding <=> query_embedding) >= min_similarity
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ponytail: no ivfflat/hnsw index in v1 — a handful of curated seed chunks make a
-- sequential scan trivially fast. Add an index when the corpus grows past ~1k rows.
