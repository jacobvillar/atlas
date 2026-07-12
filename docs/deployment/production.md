# Production

## Production Checklist

- Live URL works in incognito.
- Supabase Auth sign-up/sign-in works.
- Supabase RLS prevents cross-user report access.
- Document service health check works.
- Resume PDF/DOCX extraction works with a sample file.
- RAG seed data is loaded into Supabase.
- Environment variables are configured in the deployment host.
- API keys are not committed.
- Empty input errors are clear.
- AI failures show a user-friendly message.
- Core report generation works with a sample resume and job description.
- Roadmap quest completion persists after refresh.
- Ask Atlas answers a follow-up question for a saved report.

## Monitoring

For the capstone MVP, basic platform logs are enough. If time allows, add lightweight analytics for report generation count and error count without storing resume text.
