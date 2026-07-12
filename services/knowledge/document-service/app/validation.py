"""File upload validation for the Atlas document extraction service.

This module intentionally has zero third-party imports (only stdlib
zipfile/io) so the validation rules can be unit tested without installing
FastAPI, Docling, or any other heavy dependency.
"""

import zipfile
from io import BytesIO

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

PDF_CONTENT_TYPE = "application/pdf"
DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)
CONTENT_TYPE_BY_EXTENSION = {
    ".pdf": PDF_CONTENT_TYPE,
    ".docx": DOCX_CONTENT_TYPE,
}

# Magic-byte signatures. The client-supplied Content-Type header is not
# trustworthy, so we independently confirm the actual file bytes.
PDF_MAGIC = b"%PDF-"
DOCX_MAGIC = b"PK\x03\x04"

# Zip-bomb guard thresholds for DOCX (which is a zip container). A DOCX with
# an enormous uncompressed payload or an absurd entry count is rejected
# before Docling ever parses it.
DOCX_MAX_UNCOMPRESSED_BYTES = 100 * 1024 * 1024  # 100 MB
DOCX_MAX_ENTRY_COUNT = 2048
DOCX_REQUIRED_ENTRY = "word/document.xml"


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


def validate_file_metadata(file_name: str | None, content_type: str) -> str:
    """Ensure filename and MIME select the same trusted extractor."""
    if not file_name:
        raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")

    lower_name = file_name.lower()
    expected_content_type = next(
        (
            mime_type
            for extension, mime_type in CONTENT_TYPE_BY_EXTENSION.items()
            if lower_name.endswith(extension)
        ),
        None,
    )
    if not expected_content_type:
        raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")
    if content_type != expected_content_type:
        raise ValueError("File name and type do not match. Upload a PDF or DOCX resume.")
    return expected_content_type


def validate_content(content: bytes, content_type: str) -> None:
    """Validate that the actual file bytes match the declared content type.

    Runs after the client Content-Type check and before extraction. For
    DOCX (zip) uploads this also runs a zip-bomb / malformed-archive guard.
    PDFs are not zip containers, so the zip-bomb guard is skipped for them.

    Raises:
        ValueError: if the bytes do not match the declared type, or a DOCX
            fails its safety validation.
    """
    if content_type == PDF_CONTENT_TYPE:
        if not content.startswith(PDF_MAGIC):
            raise ValueError("File content does not match its type.")
        return

    if content_type == DOCX_CONTENT_TYPE:
        if not content.startswith(DOCX_MAGIC):
            raise ValueError("File content does not match its type.")
        _validate_docx_zip_safety(content)
        return

    # Unknown content types are already rejected by validate_upload, but
    # guard defensively if this is ever called on its own.
    raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")


def _validate_docx_zip_safety(content: bytes) -> None:
    """Reject DOCX archives that look like zip bombs or malformed zips."""
    try:
        with zipfile.ZipFile(BytesIO(content)) as zf:
            infolist = zf.infolist()
            total_uncompressed = sum(info.file_size for info in infolist)
            entry_names = {info.filename for info in infolist}

            if total_uncompressed > DOCX_MAX_UNCOMPRESSED_BYTES:
                raise ValueError("DOCX file failed safety validation.")
            if len(infolist) > DOCX_MAX_ENTRY_COUNT:
                raise ValueError("DOCX file failed safety validation.")
            if DOCX_REQUIRED_ENTRY not in entry_names:
                raise ValueError("DOCX file failed safety validation.")
    except zipfile.BadZipFile as exc:
        raise ValueError("DOCX file failed safety validation.") from exc
