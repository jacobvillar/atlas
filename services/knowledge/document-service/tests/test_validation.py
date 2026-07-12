"""Unit tests for app.validation.

These tests intentionally avoid importing fastapi/docling; app.validation
has no third-party dependencies (only stdlib zipfile/io) so this module can
run with only pytest installed.
"""

import zipfile
from io import BytesIO

import pytest

from app.validation import (
    DOCX_REQUIRED_ENTRY,
    validate_content,
    validate_upload,
)

PDF_CONTENT_TYPE = "application/pdf"
DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)
ONE_MB = 1024 * 1024


def _build_docx_bytes(entry_count: int = 1) -> bytes:
    """Build a minimal, valid-looking DOCX zip with the given entry count."""
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(DOCX_REQUIRED_ENTRY, "<xml>hello</xml>")
        for i in range(entry_count - 1):
            zf.writestr(f"word/media/image{i}.png", b"x")
    return buffer.getvalue()


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


def test_accepts_valid_pdf_magic_bytes():
    content = b"%PDF-1.4\n%synthetic-test-pdf-content\n"
    validate_content(content, PDF_CONTENT_TYPE)


def test_rejects_content_type_spoof_declared_pdf_actual_other():
    # Declares PDF but the bytes are not a PDF (e.g. spoofed Content-Type).
    content = b"this is not a pdf, just plain text pretending to be one"
    with pytest.raises(ValueError, match="File content does not match its type"):
        validate_content(content, PDF_CONTENT_TYPE)


def test_rejects_content_type_spoof_declared_docx_actual_other():
    content = b"also not a docx, no zip signature here"
    with pytest.raises(ValueError, match="File content does not match its type"):
        validate_content(content, DOCX_CONTENT_TYPE)


def test_accepts_valid_small_docx():
    validate_content(_build_docx_bytes(), DOCX_CONTENT_TYPE)


def test_rejects_docx_missing_required_entry():
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("not_a_real_docx_entry.txt", "hello")
    content = buffer.getvalue()
    with pytest.raises(ValueError, match="DOCX file failed safety validation"):
        validate_content(content, DOCX_CONTENT_TYPE)


def test_rejects_docx_with_excessive_entry_count():
    # Entry-count overflow is a deterministic, cheap way to construct a
    # zip-bomb-shaped archive without needing gigabytes of data on disk.
    content = _build_docx_bytes(entry_count=2049)
    with pytest.raises(ValueError, match="DOCX file failed safety validation"):
        validate_content(content, DOCX_CONTENT_TYPE)


def test_rejects_docx_with_huge_uncompressed_size():
    # A highly-compressible payload keeps the on-wire bytes tiny while the
    # reported uncompressed size exceeds the 100 MB guard.
    buffer = BytesIO()
    huge_payload = b"0" * (101 * 1024 * 1024)
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(DOCX_REQUIRED_ENTRY, "<xml>hello</xml>")
        zf.writestr("word/media/bomb.bin", huge_payload)
    content = buffer.getvalue()
    with pytest.raises(ValueError, match="DOCX file failed safety validation"):
        validate_content(content, DOCX_CONTENT_TYPE)


def test_rejects_malformed_zip_as_docx():
    content = b"PK\x03\x04" + b"not a real zip structure after the signature"
    with pytest.raises(ValueError, match="DOCX file failed safety validation"):
        validate_content(content, DOCX_CONTENT_TYPE)
