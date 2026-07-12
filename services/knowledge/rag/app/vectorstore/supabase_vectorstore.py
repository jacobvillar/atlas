"""Upsert curated career-guidance chunks into Supabase.

The ``supabase`` package is imported lazily inside functions so this module
can be imported without the dependency installed, keeping the offline test
suite runnable without network access or the package.
"""

from __future__ import annotations

from typing import Any, TypedDict


TABLE_NAME = "career_resource_chunks"


class CareerResourceChunkRow(TypedDict):
    id: str
    source_title: str
    source_url: str
    source_type: str
    chunk_text: str
    embedding: list[float]


def get_client(supabase_url: str, supabase_service_role_key: str) -> Any:
    """Create a Supabase client authenticated with the service-role key.

    The service-role key must never be used in browser/client code; this
    helper is only for the offline ingestion script.
    """

    from supabase import create_client  # local import: keep supabase out of module load path

    return create_client(supabase_url, supabase_service_role_key)


def upsert_chunks(client: Any, rows: list[CareerResourceChunkRow]) -> None:
    """Upsert ``rows`` into the ``career_resource_chunks`` table.

    Upserting on the primary key (``id``) makes re-running ingestion for the
    same seed content idempotent rather than creating duplicate rows.
    """

    if not rows:
        return
    client.table(TABLE_NAME).upsert(rows).execute()
