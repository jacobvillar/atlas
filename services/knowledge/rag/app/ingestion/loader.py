"""Find curated career-guidance seed files for offline ingestion."""

from __future__ import annotations

from pathlib import Path

DEFAULT_SEED_DIR = Path(__file__).resolve().parents[2] / "data" / "seed"


def find_seed_files(seed_dir: Path | None = None) -> list[Path]:
    """Return a sorted list of Markdown seed files under ``seed_dir``.

    Defaults to ``data/seed`` relative to the package root. Sorting keeps
    ingestion output deterministic across runs.
    """

    directory = seed_dir if seed_dir is not None else DEFAULT_SEED_DIR
    if not directory.exists():
        return []
    return sorted(directory.glob("*.md"))
