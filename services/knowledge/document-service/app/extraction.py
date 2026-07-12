"""Docling-based resume extraction.

Uses a module-level singleton DocumentConverter because Docling's model
load is expensive and must not happen per request.
"""

import threading
from pathlib import Path

from docling.document_converter import DocumentConverter

_converter = DocumentConverter()

# Serializes conversions deliberately: Docling's DocumentConverter is not
# documented thread-safe, and per-call converters are too expensive (model
# load cost). This lock trades some concurrency for correctness; the caller
# already runs extraction in a threadpool so this only blocks other
# extraction calls, not the event loop.
_converter_lock = threading.Lock()


def extract_resume(path: Path) -> dict:
    """Extract structured text from a resume file using Docling.

    Returns:
        A dict with "text" (stripped markdown) and "markdown" (raw markdown).
    """
    with _converter_lock:
        result = _converter.convert(str(path))
    markdown = result.document.export_to_markdown()
    return {"text": markdown.strip(), "markdown": markdown}
