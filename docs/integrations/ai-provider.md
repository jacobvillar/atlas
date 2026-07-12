# AI Provider Integration

## Provider Choice

Atlas v1 uses OpenAI because the course environment provides access to OpenAI models.

Models:

```text
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Model Responsibilities

`gpt-4o-mini` is used for:

- Career readiness report generation.
- Resume bullet suggestions.
- 30/60/90-day roadmap quest generation.
- Ask Atlas follow-up answers.

`text-embedding-3-small` is used for:

- Embedding curated career guidance chunks.
- Embedding retrieval queries for RAG.

## Server-Side Rules

- `OPENAI_API_KEY` must be read only in server-side code.
- Client components must never import OpenAI SDK clients.
- Prompt construction must happen server-side.
- Responses must be validated against schemas before rendering or saving.
- Roadmap quests must include stable quest IDs, phase, title, role-fit reason, evidence output, time estimate, and difficulty.
- Prompt inputs should include only the required resume text, job description, retrieved guidance, and report context.

## Environment Variables

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Provider Boundary

The web app should isolate provider logic under:

```text
apps/web/src/core/ai/
  prompts.ts
  schemas.ts
  openai.ts
```

The rest of the app should call domain functions such as `generateCareerReport` and `answerAskAtlas`, not raw OpenAI SDK methods.
