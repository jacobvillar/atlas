-- Recreate match_career_resources with a pinned search_path (Supabase linter
-- recommendation: prevents search-path shadowing). Behavior is unchanged.
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
set search_path = public
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
