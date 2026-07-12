"""Environment-driven settings for the career-guidance ingestion pipeline.

This module only reads configuration; it never hardcodes secrets. Values are
read lazily via ``get_settings()`` so importing this module has no side
effects and does not require the environment variables to be set (useful for
tests that only exercise pure logic).
"""

from __future__ import annotations

import os
from dataclasses import dataclass


DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"


@dataclass(frozen=True)
class Settings:
    openai_api_key: str | None
    openai_embedding_model: str
    supabase_url: str | None
    supabase_service_role_key: str | None


def get_settings() -> Settings:
    """Read settings from environment variables.

    Values are read on demand rather than at import time so this module can
    be imported safely without any environment variables configured.
    """

    return Settings(
        openai_api_key=os.environ.get("OPENAI_API_KEY"),
        openai_embedding_model=os.environ.get(
            "OPENAI_EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL
        ),
        supabase_url=os.environ.get("SUPABASE_URL"),
        supabase_service_role_key=os.environ.get("SUPABASE_SERVICE_ROLE_KEY"),
    )
