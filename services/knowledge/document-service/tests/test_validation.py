"""Unit tests for app.validation.

These tests intentionally avoid importing fastapi/docling; app.validation
has no third-party dependencies so this module can run with only pytest
installed.
"""

import pytest

from app.validation import validate_upload

PDF_CONTENT_TYPE = "application/pdf"
DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)
ONE_MB = 1024 * 1024


def test_accepts_pdf_under_limit():
    validate_upload(content_type=PDF_CONTENT_TYPE, size_bytes=1 * ONE_MB, max_mb=5)


def test_accepts_docx_under_limit():
    validate_upload(content_type=DOCX_CONTENT_TYPE, size_bytes=1 * ONE_MB, max_mb=5)


def test_rejects_unsupported_content_type():
    with pytest.raises(ValueError, match="Unsupported file type"):
        validate_upload(content_type="image/png", size_bytes=1 * ONE_MB, max_mb=5)


def test_rejects_file_too_large():
    with pytest.raises(ValueError, match="File is too large"):
        validate_upload(content_type=PDF_CONTENT_TYPE, size_bytes=6 * ONE_MB, max_mb=5)
