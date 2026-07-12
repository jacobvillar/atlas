"""Offline/admin orchestration script: load, chunk, embed, and upsert curated
career-guidance Markdown into the Supabase ``career_resource_chunks`` table.

This script is intentionally NOT part of the runtime web app. Run it by hand
(or from an admin CI job) whenever the curated seed content changes:

    python scripts/load_career_resources.py

It requires ``OPENAI_API_KEY``, ``SUPABASE_URL``, and
``SUPABASE_SERVICE_ROLE_KEY`` to be set in the environment, and the
``openai``/``supabase`` packages installed. It is not covered by the offline
test suite for that reason.
"""

from __future__ import annotations

import hashlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config.settings import get_settings
from app.embeddings.embedder import embed_texts
from app.ingestion.chunker import chunk_text
from app.ingestion.loader import find_seed_files
from app.ingestion.parser import parse_document
from app.vectorstore.supabase_vectorstore import CareerResourceChunkRow, get_client, upsert_chunks


def stable_id(source_path: Path, index: int, chunk: str) -> str:
    """Derive a deterministic chunk id so re-ingestion upserts in place."""

    digest = hashlib.sha1(f"{source_path}:{index}:{chunk}".encode("utf-8")).hexdigest()
    return f"{source_path.stem}_{index}_{digest[:12]}"


def build_rows(seed_paths: list[Path]) -> tuple[list[CareerResourceChunkRow], list[str]]:
    """Parse and chunk every seed file, returning rows (minus embeddings) and
    the flat list of chunk texts to embed, in matching order."""

    rows: list[CareerResourceChunkRow] = []
    texts: list[str] = []

    for source_path in seed_paths:
        raw_text = source_path.read_text(encoding="utf-8")
        parsed = parse_document(raw_text)
        chunks = chunk_text(parsed.body)

        for index, chunk in enumerate(chunks):
            row: CareerResourceChunkRow = {
                "id": stable_id(source_path, index, chunk),
                "source_title": parsed.source_title,
                "source_url": parsed.source_url,
                "source_type": parsed.source_type,
                "chunk_text": chunk,
                "embedding": [],  # filled in after embedding
            }
            rows.append(row)
            texts.append(chunk)

    return rows, texts


def main() -> None:
    settings = get_settings()

    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is required to run ingestion")
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to run ingestion"
        )

    seed_paths = find_seed_files()
    if not seed_paths:
        print("No seed files found under data/seed; nothing to ingest.")
        return

    rows, texts = build_rows(seed_paths)
    print(f"Prepared {len(rows)} chunks from {len(seed_paths)} seed files.")

    embeddings = embed_texts(
        texts,
        model=settings.openai_embedding_model,
        api_key=settings.openai_api_key,
    )
    for row, embedding in zip(rows, embeddings):
        row["embedding"] = embedding

    client = get_client(settings.supabase_url, settings.supabase_service_role_key)
    upsert_chunks(client, rows)
    print(f"Upserted {len(rows)} chunks into career_resource_chunks.")


if __name__ == "__main__":
    main()
