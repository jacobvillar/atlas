# Privacy and Safety Notes

Atlas handles sensitive career materials such as resumes and job descriptions. Version 1 should treat these inputs as request-scoped data.

## Rules

- Do not store resumes or job descriptions by default.
- Do not print raw resume content in server logs.
- Do not expose AI provider keys in client-side code.
- Show users that Atlas provides guidance, not a hiring guarantee.
- Keep `.env.local` out of git.

## Deployment Secrets

AI provider keys must be configured through the deployment host's environment variable settings. Local development should use `.env.local`.

## User Guidance

Users should avoid uploading unnecessary sensitive information. The app should only require resume-relevant information and the target job description.

