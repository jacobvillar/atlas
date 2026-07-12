"""Docling-based resume extraction.

Uses a module-level singleton DocumentConverter because Docling's model
load is expensive and must not happen per request.
"""

from pathlib import Path

from docling.document_converter import DocumentConverter

_converter = DocumentConverter()


def extract_resume(path: Path) -> dict:
    """Extract structured text from a resume file using Docling.

    Returns:
        A dict with "text" (stripped markdown) and "markdown" (raw markdown).
    """
    result = _converter.convert(str(path))
    markdown = result.document.export_to_markdown()
    return {"text": markdown.strip(), "markdown": markdown}
