"""FastAPI app for the Atlas document extraction service.

Privacy note: never log raw resume text or file contents. Only log
non-sensitive metadata (e.g. file name, file type, byte size) if needed.
"""

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.extraction import extract_resume
from app.validation import validate_upload

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

    if x_api_key != expected_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    content = await file.read()

    max_mb = int(os.getenv("MAX_UPLOAD_MB", "5"))
    try:
        validate_upload(
            content_type=file.content_type or "",
            size_bytes=len(content),
            max_mb=max_mb,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    suffix = Path(file.filename or "").suffix

    with tempfile.NamedTemporaryFile(delete=True, suffix=suffix) as tmp:
        tmp.write(content)
        tmp.flush()
        extraction = extract_resume(Path(tmp.name))

    return {
        "fileName": file.filename,
        "fileType": file.content_type,
        "text": extraction["text"],
        "markdown": extraction["markdown"],
    }
