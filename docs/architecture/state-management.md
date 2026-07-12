# State Management

Atlas v1 can use local React component state plus server data from Supabase. A global state library is unnecessary for the initial workflow.

## UI States

- Signed out
- Signed in, no report yet
- Resume upload ready
- Resume extracting
- Resume extraction failed
- Extracted text ready for review
- Job description invalid
- Ready to analyze
- Report generating
- Report ready
- Roadmap quest progress updating
- Roadmap quest progress error
- Ask Atlas disabled
- Ask Atlas loading
- Error

## State Shape

```ts
type AnalyzeState =
  | { status: "idle" }
  | { status: "extracting" }
  | { status: "review"; resumeText: string; resumeDocumentId?: string }
  | { status: "invalid"; message: string }
  | { status: "loading" }
  | { status: "success"; reportId: string; report: AtlasReport; questProgress: QuestProgress[] }
  | { status: "error"; message: string };
```

## Rule

Keep transient resume text in page state. Persist only metadata, generated reports, roadmap quest progress, and Ask Atlas messages through Supabase.

Quest completion can use optimistic UI, but the saved report detail should reconcile against Supabase after updates.
