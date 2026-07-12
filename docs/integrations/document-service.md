# Document Service Integration

Atlas uses a Python FastAPI service with `pypdfium2` for PDFs and `python-docx` for DOCX files to extract resume text.

## Responsibility

The document service handles private user documents at runtime:

- Accept PDF/DOCX resume upload.
- Validate file type and size.
- Run format-specific text extraction.
- Return extracted text/markdown and metadata.
- Delete temporary files.
- Avoid persistent file storage.

It does not:

- Store resume files.
- Store full raw resume text.
- Insert resumes into the RAG vector database.
- Generate career advice.

## Endpoint

```text
POST /extract-resume
```

Request:

- `multipart/form-data`
- `file`: PDF or DOCX

Response:

```json
{
  "fileName": "resume.pdf",
  "fileType": "application/pdf",
  "text": "string",
  "markdown": "string"
}
```

## Security

- The service should require an internal API key shared with the web app.
- The web app should call the service from a server route, not directly from browser code.
- The service should log metadata and errors only, not raw resume text.

## Web Proxy Route

The browser uploads resumes to the Next.js route `POST /api/extract-resume`. That route verifies the Supabase session, validates the file, forwards the upload to the document service with `DOCUMENT_SERVICE_API_KEY`, saves only metadata, and returns extracted text for immediate review.

## Deployment

Deploy the document service to Render or Railway.

Required environment variables:

```text
DOCUMENT_SERVICE_API_KEY=
MAX_UPLOAD_MB=5
```

The web app uses:

```text
DOCUMENT_SERVICE_URL=
DOCUMENT_SERVICE_API_KEY=
```
