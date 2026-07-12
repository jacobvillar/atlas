# Input Validation

## Auth Rules

- User must be authenticated before resume extraction, analysis, saved report access, or Ask Atlas.
- API routes must verify report ownership before returning reports, saving Ask Atlas messages, or updating roadmap quest progress.

## Resume Upload Rules

- Supported file types: PDF and DOCX.
- Require a matching PDF/DOCX filename and declared MIME type, then verify content signatures server-side.
- Reject unsupported MIME types.
- Reject files over the configured maximum size.
- Extracted text must be shown to the user for review before analysis.

## Analyze Request Rules

- Reviewed resume text is required.
- Job description text is required.
- Inputs must meet a minimum useful length.
- Inputs must stay under the configured maximum length.

## Ask Atlas Rules

- `careerReportId` is required.
- Question text is required.
- Ask Atlas is available only after a report exists.
- Ask Atlas requests must not require full raw resume text.

## Roadmap Quest Rules

- `careerReportId` is required.
- `questId` is required.
- Quest ID must exist in the saved report JSON.
- Status must be `not_started` or `completed`.
- Quest progress updates are available only for reports owned by the current user.

## Error Behavior

Validation errors should be shown before any OpenAI request is made.

## Suggested Limits

- Minimum resume text: 50 characters.
- Minimum job description text: 50 characters.
- Maximum resume text: 20,000 characters.
- Maximum job description text: 15,000 characters.
- Maximum resume upload: 5 MB.
