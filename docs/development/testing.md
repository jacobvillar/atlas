# Testing

## Required Test Areas

Atlas should include at least three unit tests for the graded project. The MVP plan includes more than three:

1. Analyze request validation rejects missing or short resume text.
2. Analyze request validation rejects missing or short job description text.
3. Ask Atlas validation rejects missing report IDs and short questions.
4. Report schema rejects malformed AI responses.
5. RAG chunking keeps source metadata and splits long documents.
6. Document service rejects unsupported file types.
7. Document service rejects oversized files.
8. Roadmap quest progress accepts only valid statuses.
9. Roadmap quest progress cannot be updated across users.

## Planned Commands

Web app:

```bash
cd apps/web
npm run lint
npm run build
npm test -- --run
```

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

GitHub Actions should run lint, tests, and a hardcoded secrets scan. CI should not fail only because optional documentation files are missing.
