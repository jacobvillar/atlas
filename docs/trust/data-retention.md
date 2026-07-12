# Data Retention

## Version 1 Policy

Atlas v1 stores user-owned product outputs, not raw source documents.

Stored:

- User profile metadata from Supabase Auth.
- Resume metadata and a short extracted text preview.
- Target job description text attached to a saved report.
- Structured resume evidence extracted during analysis.
- Generated report JSON and fit score.
- Roadmap quest completion state linked to a saved report.
- Ask Atlas user/assistant messages linked to a report.
- Curated career guidance chunks used for RAG.

Not stored:

- Uploaded resume files.
- Full raw resume text.
- Private user resumes in the RAG vector database.

## User Expectation

The user signs in before analysis. Generated reports, roadmap quest progress, and Ask Atlas messages are saved so the user can revisit them. Resume files and full extracted resume text are processed temporarily and discarded.

## Future Requirements

If Atlas stores richer career materials later, it should provide:

- Clear retention notice.
- Delete controls.
- Export controls.
- Explicit opt-in for full resume storage.
- User ownership boundaries enforced by row-level security.
