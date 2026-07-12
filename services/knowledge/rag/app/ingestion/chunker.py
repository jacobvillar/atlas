"""Split document bodies into overlapping chunks for embedding."""

from __future__ import annotations


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 150) -> list[str]:
    """Chunk ``text`` into a sliding window of ``chunk_size`` characters.

    If the whole (stripped) text already fits within ``chunk_size`` it is
    returned as a single chunk. Otherwise the text is split using a sliding
    window that advances by ``chunk_size - overlap`` characters per step,
    so consecutive chunks share ``overlap`` characters of context. Empty or
    whitespace-only chunks are skipped.
    """

    stripped = text.strip()
    if len(stripped) <= chunk_size:
        return [stripped]

    step = chunk_size - overlap
    if step <= 0:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks: list[str] = []
    start = 0
    text_length = len(stripped)
    while start < text_length:
        window = stripped[start : start + chunk_size].strip()
        if window:
            chunks.append(window)
        start += step

    return chunks
