# Testing

## Required Test Areas

Atlas includes focused unit tests and a browser-level smoke suite. The MVP plan includes more than the three basic tests required for the graded project:

1. Analyze request validation rejects missing or short resume text.
2. Analyze request validation rejects missing or short job description text.
3. Ask Atlas validation rejects missing report IDs and short questions.
4. Report schema rejects malformed AI responses.
5. RAG chunking keeps source metadata and splits long documents.
6. Document service rejects unsupported file types.
7. Document service rejects oversized files.
8. Roadmap quest progress accepts only valid statuses.
9. Roadmap quest progress cannot be updated across users.
10. A visitor can navigate from the landing page to a use case in Chromium.
11. An unauthenticated visitor is redirected to login before the analysis workflow.
12. A dedicated test user can sign in and reach the dashboard when test credentials are explicitly configured.
13. An explicit, live-only browser journey can create and open a readiness report using synthetic input.

## Planned Commands

Web app:

```bash
cd apps/web
npm run lint
npm run build
npm test -- --run
npm run test:e2e
```

`npm run test:e2e` starts the app on port `3100` with dummy public Supabase
values and runs the no-cost Chromium smoke suite. It does not call OpenAI or
create data.

When you already have Atlas running locally on port `3000`, point Playwright
at that server instead of starting a second Next development process:

```bash
cd apps/web
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

To run the optional authenticated smoke test against a deployed environment,
use a dedicated Supabase account and keep its credentials outside the repo:

```bash
cd apps/web
PLAYWRIGHT_BASE_URL=https://atlas-wheat-iota.vercel.app \
E2E_TEST_EMAIL=atlas-e2e@example.com \
E2E_TEST_PASSWORD='your-test-password' \
npm run test:e2e
```

The authenticated test verifies sign-in and dashboard access. The analysis
generation flow is opt-in because it creates user data and consumes OpenAI
budget. Run it only with a dedicated account and synthetic content:

```bash
cd apps/web
PLAYWRIGHT_BASE_URL=https://atlas-wheat-iota.vercel.app \
E2E_TEST_EMAIL=atlas-e2e@example.com \
E2E_TEST_PASSWORD='your-test-password' \
E2E_RUN_AI_FLOW=true \
npm run test:e2e -- readiness-report.live.spec.ts
```

The live journey creates a saved report. It is never run by CI and should only
be run deliberately while validating a deployed environment.

Document service:

```bash
cd services/knowledge/document-service
pytest
```

RAG ingestion:

```bash
cd services/knowledge/rag
pytest
```

## CI

GitHub Actions runs lint, build, unit tests, the no-cost Chromium smoke suite,
and a hardcoded-secrets scan. CI never receives real Supabase, OpenAI, or test
account credentials.
