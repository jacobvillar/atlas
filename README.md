# Atlas

Map your next career move.

Atlas is an AI-powered career readiness web application for fresh graduates and early-career professionals. Users provide a resume and a target job description, then receive a structured role-fit analysis, resume improvement suggestions, and a practical 30/60/90-day career roadmap.

## Problem

Fresh graduates and early-career job seekers often struggle to understand why their resume does or does not fit a target role. Generic AI resume advice can be helpful, but it often stops at rewriting bullets instead of explaining the gap and turning it into a next-step plan.

## MVP

- Paste or upload resume content
- Paste a target job description
- Extract skills, experience, tools, education, and project evidence
- Compare the resume against the target role
- Generate:
  - role-fit summary
  - fit score
  - strengths
  - gaps
  - improved resume bullets
  - 30/60/90-day roadmap
  - suggested portfolio project

## Tagline

Atlas: Map your next career move.

## Planned Stack

- Frontend: Next.js + Tailwind CSS
- AI layer: server-side API route using an LLM provider
- Validation: Zod schemas for request and response shape
- Testing: unit tests for validation, prompt construction, and output formatting
- Deployment: Vercel
- CI/CD: GitHub Actions

## Documentation

- [Idea Validation Report](docs/idea-validation.md)
- [Product Requirements Document](docs/prd.md)
- [Spec](spec.md)
- [Architecture Notes](docs/architecture.md)
- [Brand Guidelines](docs/brand-guidelines.md)

## Privacy Notes

Atlas is designed as a capstone MVP. Version 1 should not store resumes or job descriptions by default. Inputs should be processed for the active request and discarded unless a later version adds explicit user accounts, consent, and data retention controls.

