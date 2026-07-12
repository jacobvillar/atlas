# Atlas Submission Checklist

## Repository

- [x] Repository is public: `https://github.com/jacobvillar/atlas`
- [x] Seven-step validation report is complete with sources and a primary-test plan.
- [x] One-page PRD has problem, target users, core features, out of scope, success metrics, and open questions.
- [x] `spec.md` defines context/goal, inputs/outputs, behavior/edge cases, technical constraints, and testable acceptance criteria.
- [x] Architecture notes, `CLAUDE.md`, and `.cursorrules` are present.
- [x] README documents the product, architecture, setup, and deployment path.
- [x] GitHub Actions runs lint, tests, build, Python tests, and secret scanning.

## Deployment

- [x] Deploy the Python document service and verify its health endpoint.
- [x] Add `DOCUMENT_SERVICE_URL`, `DOCUMENT_SERVICE_API_KEY`, Supabase variables, and OpenAI variables to Vercel.
- [x] Deploy the Next.js app from `apps/web` to Vercel.
- [x] Add the live URL to the README and confirm public pages and guards without a session.
- [ ] Run a sanitized PDF/DOCX extraction, analysis, quest update, and Ask Atlas question on the live app.

## Recording and Reflection

- [ ] Record the walkthrough using [the two-minute script](demo-script.md).
- [ ] Upload the recording and add its accessible link below.
- [ ] Review and personalize [the reflection](reflection.md) before submitting it.
- [ ] Add the final live URL and recording URL here:

```text
Live application: https://atlas-wheat-iota.vercel.app
Demo recording:
```

## Final Validation Evidence

- [ ] Run the five-user concierge test described in [Idea Validation](../product/idea-validation.md).
- [ ] Add the anonymized result table and at least three consented quotes to the validation report.
- [ ] Confirm GitHub Actions is green on `main`.
- [x] Create and link one v2 GitHub issue: [#2 - Let users delete saved reports](https://github.com/jacobvillar/atlas/issues/2)
