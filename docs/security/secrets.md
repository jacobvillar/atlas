# Secrets Management

## Rules

- Store local web app secrets in `apps/web/.env.local`.
- Store local document-service secrets in a service `.env` file.
- Store deployment keys in Vercel, Render, Railway, and Supabase environment settings.
- Do not expose server secrets with `NEXT_PUBLIC_`.
- Do not print secrets in logs.
- Keep `.env.local` and service `.env` files ignored by git.

## Required Secrets

Web app:

```text
OPENAI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DOCUMENT_SERVICE_API_KEY=
```

Document service:

```text
DOCUMENT_SERVICE_API_KEY=
```

Public browser-safe variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## CI

The initial CI workflow scans for obvious committed API key patterns. Full lint/type/test checks should run after the application scaffold is created.
