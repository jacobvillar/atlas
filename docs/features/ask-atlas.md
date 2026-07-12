# Ask Atlas

Ask Atlas is a focused follow-up chat that becomes available after the user generates a career report.

## Scope

Ask Atlas can answer questions such as:

- Which gap should I fix first?
- Rewrite these bullets for this target role.
- Give me a 2-week version of these roadmap quests.
- Which quest should I complete first?
- Break this quest into smaller steps.
- What portfolio project should I prioritize?
- How do I explain this career shift?

## Context

Ask Atlas uses:

- The saved report JSON.
- The structured resume evidence saved with the report.
- The saved roadmap quests and quest progress.
- The target job description or job summary.
- Retrieved career guidance chunks from the RAG knowledge base.
- Prior messages linked to the same report.

## Constraints

- Ask Atlas is simple request/response in v1.
- No streaming responses in v1.
- No long-term memory outside messages linked to a report.
- Raw resume text is not stored in chat history.
- Ask Atlas should not require raw resume text after the report is created.
- Ask Atlas must verify report ownership before answering.

## Acceptance Criteria

- Ask Atlas is hidden or disabled before report generation.
- A signed-in user can ask a question after generating a report.
- The answer references the current report context.
- The answer can include source titles from retrieved RAG chunks.
- User and assistant messages are saved under the correct report.
