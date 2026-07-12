# Resume Analysis

## Goal

Extract useful career evidence from a PDF/DOCX resume and compare it against a target job description.

## Output Sections

- Matching skills
- Relevant experience
- Evidence gaps
- Missing tools or qualifications
- Resume bullet suggestions
- RAG source titles used for guidance

## Guardrails

- Require authentication before analysis.
- Extract resume text through the private FastAPI document service.
- Let the user review extracted text before analysis.
- Do not store uploaded resume files.
- Do not store full raw resume text.
- Do not invent experience.
- Recommend adding evidence only when the user likely has it.
- Phrase suggestions as drafts that the user must verify.
