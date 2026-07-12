# Server Actions and API

## Web App API Routes

Atlas uses Next.js route handlers for auth-aware server work.

### `POST /api/extract-resume`

Proxies a resume upload to the private document service.

Request:

- `multipart/form-data`
- `file`: PDF or DOCX resume

Response:

```json
{
  "resumeDocumentId": "uuid",
  "fileName": "resume.pdf",
  "fileType": "application/pdf",
  "text": "string",
  "markdown": "string"
}
```

Rules:

- Require authenticated Supabase session.
- Validate MIME type and size before proxying.
- Call the document service from server-side code only.
- Save resume metadata (no preview) under the current user.
- Return extracted text for immediate user review.
- Do not store the uploaded file or full extracted text.

### `POST /api/analyze`

Generates a career readiness report.

Request:

```json
{
  "resumeDocumentId": "uuid",
  "resumeText": "string",
  "jobDescriptionText": "string",
  "targetRole": "string"
}
```

Response:

```json
{
  "reportId": "uuid",
  "fitScore": 78,
  "targetRole": "Junior Data Analyst",
  "summary": "string",
  "resumeEvidence": {
    "skills": ["string"],
    "tools": ["string"],
    "education": ["string"],
    "experienceThemes": ["string"],
    "projects": ["string"],
    "constraints": ["string"]
  },
  "strengths": ["string"],
  "gaps": ["string"],
  "resumeSuggestions": ["string"],
  "roadmapQuests": [
    {
      "questId": "q_30_resume_keywords",
      "phase": "30",
      "title": "Add evidence for Excel reporting",
      "whyItMatters": "string",
      "evidenceOutput": "string",
      "timeEstimate": "30 minutes",
      "difficulty": "quick_win",
      "category": "resume_evidence",
      "status": "not_started"
    }
  ],
  "projectSuggestion": "string",
  "milestoneBadges": ["Resume Ready"],
  "sourceTitles": ["string"],
  "disclaimer": "string"
}
```

Rules:

- Require authenticated Supabase session.
- Validate input length and shape.
- Retrieve top career guidance chunks from Supabase.
- Call OpenAI server-side only.
- Validate model output before saving.
- Save report under the current user.
- Save structured `resume_evidence_json`, not full raw resume text.
- Save initial roadmap quest progress rows for generated quests.
- Return computed milestone badges from quest progress where applicable.
- Do not save full raw resume text.

### `POST /api/ask`

Answers a follow-up question for an existing report.

Request:

```json
{
  "careerReportId": "uuid",
  "question": "Which gap should I fix first?"
}
```

Response:

```json
{
  "answer": "string",
  "suggestedActions": ["string"],
  "sourceTitles": ["string"]
}
```

Rules:

- Require authenticated Supabase session.
- Verify the report belongs to the current user.
- Retrieve report JSON, structured resume evidence, quest progress, and relevant career guidance chunks.
- Save user and assistant messages.
- Do not require or store long-term raw resume text.

### Report Routes

- `GET /api/reports`
- `GET /api/reports/[id]`
- `PATCH /api/reports/[id]/quests/[questId]`

Rules:

- Require authenticated Supabase session.
- Return only reports owned by the current user.
- Quest progress updates must verify report ownership.
- Quest progress updates must allow only `not_started` and `completed`.

### `PATCH /api/reports/[id]/quests/[questId]`

Updates completion state for one roadmap quest.

Request:

```json
{
  "status": "completed"
}
```

Response:

```json
{
  "questId": "q_30_resume_keywords",
  "status": "completed",
  "completedAt": "2026-07-12T10:00:00.000Z",
  "milestoneBadges": ["Resume Ready"]
}
```

Rules:

- Require authenticated Supabase session.
- Verify the report belongs to the current user.
- Verify the quest ID exists in the report JSON.
- Update only the progress row, not the AI-generated report body.
- Return updated computed milestone badges.

## Document Service API

The document service is a separate Python FastAPI service.

### `GET /api/health`

Returns service status for deployment health checks.

### `POST /extract-resume`

Request:

- `multipart/form-data`
- `file`: PDF or DOCX resume

Response:

```json
{
  "fileName": "resume.pdf",
  "fileType": "application/pdf",
  "text": "string",
  "markdown": "string"
}
```

Rules:

- Require an internal API key from the Next.js app, and fail closed: if no key is configured, reject every request. Check declared `Content-Length` before buffering the body.
- Never call this service directly from browser code.
- Reject unsupported MIME types.
- Reject files over the configured size limit.
- Use Docling to convert the document.
- Delete temporary files after extraction.
- Return extracted content to the web app without storing the file.
