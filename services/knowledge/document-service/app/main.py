"""FastAPI app for the Atlas document extraction service.

Privacy note: never log raw resume text or file contents. Only log
non-sensitive metadata (e.g. file name, file type, byte size) if needed.
"""

import hmac
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from app.extraction import extract_resume
from app.validation import validate_content, validate_file_metadata, validate_upload

app = FastAPI(title="Atlas Document Service")


@app.get("/api/health")
async def health() -> dict:
    return {"status": "healthy"}


@app.post("/extract-resume")
async def extract_resume_endpoint(
    file: UploadFile,
    x_api_key: str | None = Header(default=None, alias="x-api-key"),
):
    expected_api_key = os.getenv("DOCUMENT_SERVICE_API_KEY")
    if not expected_api_key:
        return JSONResponse(
            status_code=503, content={"detail": "Service not configured"}
        )

    # Timing-safe comparison: a naive `!=` leaks key bytes via response
    # timing. compare_digest runs in constant time regardless of match.
    if not hmac.compare_digest(x_api_key or "", expected_api_key):
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = await file.read()

    max_mb = int(os.getenv("MAX_UPLOAD_MB", "5"))
    content_type = file.content_type or ""
    try:
        validate_file_metadata(file.filename, content_type)
        validate_upload(
            content_type=content_type,
            size_bytes=len(content),
            max_mb=max_mb,
        )
        validate_content(content, content_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    suffix = Path(file.filename or "").suffix

    # delete=False + explicit unlink in finally: NamedTemporaryFile(delete=True)
    # re-opened by path inside the with-block is POSIX-only (Windows can't
    # open an already-open delete-on-close temp file by name).
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        tmp.write(content)
        tmp.close()
        # Run blocking document extraction off the event loop so it doesn't
        # stall /api/health and other concurrent requests during conversion.
        extraction = await run_in_threadpool(extract_resume, Path(tmp.name))
    finally:
        Path(tmp.name).unlink(missing_ok=True)

    return {
        "fileName": file.filename,
        "fileType": file.content_type,
        "text": extraction["text"],
        "markdown": extraction["markdown"],
    }
