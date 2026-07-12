"""File upload validation for the Atlas document extraction service.

This module intentionally has zero third-party imports so the validation
rules can be unit tested without installing FastAPI, Docling, or any other
heavy dependency.
"""

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def validate_upload(content_type: str, size_bytes: int, max_mb: int = 5) -> None:
    """Validate an uploaded resume file's content type and size.

    Raises:
        ValueError: if the content type is unsupported or the file exceeds
            the maximum allowed size.
    """
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")

    max_bytes = max_mb * 1024 * 1024
    if size_bytes > max_bytes:
        raise ValueError(f"File is too large. Maximum size is {max_mb} MB.")
