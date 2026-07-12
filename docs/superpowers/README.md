# Superpowers Workflow

This folder is for agentic development specs and implementation plans. Use it when a feature is large enough that future coding agents need a precise, dated handoff.

## Purpose

Each major feature should have a dated spec or plan so work can be broken into small, reviewable tasks.

Examples:

```text
docs/superpowers/specs/2026-07-12-auth-and-dashboard-spec.md
docs/superpowers/plans/2026-07-12-auth-and-dashboard-plan.md
docs/superpowers/specs/2026-07-13-rag-ingestion-spec.md
docs/superpowers/plans/2026-07-13-rag-ingestion-plan.md
```

## Current Plans

- [Atlas MVP Implementation Plan](plans/2026-07-12-atlas-mvp.md)
- [Atlas MVP Tickets](tickets/atlas-mvp-tickets.md)

## Conventions

- Use `YYYY-MM-DD-feature-name.md`.
- Keep one plan focused on one major feature or vertical slice.
- Include exact files to create or modify.
- Include test commands and expected outcomes.
- Include commit checkpoints, but do not commit unless the user approves.
- Update the plan as decisions change so agents do not rely on stale chat context.
