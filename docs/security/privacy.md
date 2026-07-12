# Privacy and Safety Notes

Atlas handles sensitive career materials such as resumes and job descriptions. Version 1 should store only what is needed to provide saved reports and report-specific follow-up chat.

## Rules

- Require login before analysis.
- Do not store uploaded resume files.
- Do not store full raw resume text.
- Store resume metadata and a short extracted text preview only.
- Store structured resume evidence extracted during analysis so saved Ask Atlas can work without raw resume storage.
- Store generated report JSON because it is the user's saved product output.
- Store roadmap quest progress because it is part of the user's saved product output.
- Store Ask Atlas messages linked to the saved report.
- Do not print raw resume content in server logs.
- Do not expose OpenAI or Supabase service role keys in client-side code.
- Show users that Atlas provides guidance, not a hiring guarantee.
- Keep `.env.local` and service `.env` files out of git.

## RAG Boundary

Atlas uses a curated career guidance knowledge base for RAG. User resumes, job descriptions, generated reports, Ask Atlas messages, and roadmap quest progress are not added to the shared knowledge base in v1.

## Deployment Secrets

Secrets must be configured through the deployment host's environment variable settings. Local development should use `.env.local` for the web app and a local `.env` file for the document service.

## User Guidance

Users should avoid uploading unnecessary sensitive information. The app should only require resume-relevant information and the target job description.
