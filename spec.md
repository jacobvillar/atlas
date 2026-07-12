# Atlas Spec

## Product Summary

Atlas is an AI-powered career readiness app that turns a resume and a target job description into a role-fit analysis and a 30/60/90-day career roadmap.

## Inputs

- `resumeText`: plain text extracted from a resume or pasted by the user
- `jobDescriptionText`: target job description pasted by the user
- Optional `targetRole`: user-provided role title

## Outputs

Atlas returns a structured report with:

- `fitScore`: readiness estimate from 0 to 100
- `summary`: plain-language role-fit summary
- `strengths`: resume evidence that matches the role
- `gaps`: missing or weak areas
- `resumeSuggestions`: improved bullets or evidence to add
- `roadmap30Days`: immediate actions
- `roadmap60Days`: portfolio and skill-building actions
- `roadmap90Days`: application and interview readiness actions
- `projectSuggestion`: one portfolio project aligned to the role
- `disclaimer`: career guidance disclaimer

## Functional Requirements

1. User can enter resume content.
2. User can enter a target job description.
3. App validates that both inputs are present and long enough to analyze.
4. App sends the request only to a server-side API route.
5. API route calls the AI provider using a private environment variable.
6. AI response is validated against the expected output shape.
7. UI renders a readable report with separate sections.
8. User can copy or export the report.

## Non-Functional Requirements

- No API keys may be exposed client-side.
- Empty or invalid input must show clear errors.
- App should avoid storing resumes or job descriptions in v1.
- Core report generation should complete in under 60 seconds for normal input sizes.
- UI should be usable on desktop and mobile.

## Acceptance Criteria

- Given valid resume and job description text, the app returns a complete report.
- Given missing resume text, the app shows a validation error.
- Given missing job description text, the app shows a validation error.
- The generated report includes fit score, strengths, gaps, roadmap, and resume suggestions.
- The API key is read only from server-side environment variables.
- CI runs tests on pull request or push.

## Test Plan

- Unit test input validation.
- Unit test prompt construction to ensure resume and job text are included.
- Unit test output schema parsing.
- UI smoke test for empty state and generated report state.

