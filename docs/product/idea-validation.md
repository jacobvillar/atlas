# Atlas Idea Validation Report

**Product:** Atlas - Map your next career move.

**Validation decision:** Build the MVP around one private workflow: a fresh graduate, early-career professional, or career shifter brings one resume and one target role, receives a grounded readiness report, then works through a short, trackable career campaign. Atlas accepts a pasted job description for any role; its first career-path presets and curated resources focus on AI, data, and adjacent early-career roles.

**Evidence note:** This report separates public secondary evidence from the low-cost primary test still to be run. Public evidence validates the problem, market, alternatives, timing, and adjacent willingness to pay. The primary test is deliberately small so the owner can collect direct evidence before final submission without claiming results that have not occurred.

## 1. Define the Problem

**Problem.** A job seeker may have a resume and a target job but still cannot tell what evidence is relevant, which gaps matter most, or what to do before applying. Existing scanners can surface keywords and generic chat can draft advice, but neither reliably turns one role-fit review into a private, sequenced plan the user can work through.

**Evidence.** The Federal Reserve Bank of New York reported that the U.S. unemployment rate for recent college graduates was about 5.7% and underemployment was 41.5% in 2026 Q1. Its data describes a difficult transition from college to work rather than a purely resume-formatting problem. [Federal Reserve Bank of New York: The Labor Market for Recent College Graduates](https://www.newyorkfed.org/research/college-labor-market)

Jobscan's public product flow itself asks users to upload a resume, paste a job description, identify missing skills, and act on the match report. That is direct category evidence that role-specific comparison is an active job-search task. [Jobscan Resume Matcher](https://www.jobscan.co/resume-matcher)

**Decision.** Atlas should solve the post-review problem as well as the comparison problem: show evidence, explain the highest-impact gaps, and turn those gaps into small, trackable actions.

## 2. Profile the Target Customer

**Primary user.** A fresh graduate or early-career professional (roughly their first one to three professional years) who is applying for a first or next role. They have coursework, projects, internships, or early work experience but need to make it legible for a role they want.

**Secondary user.** A career shifter who needs to connect transferable experience to a new field and wants a concrete proof-building plan rather than another generic resume rewrite.

**Evidence.** The U.S. National Center for Education Statistics reports 1,965,000 bachelor's degrees conferred in 2022-23, while the U.S. Bureau of Labor Statistics reported that 1.2 million people aged 20-29 earned a bachelor's degree between January and October 2024. These are identifiable, recurring cohorts entering or changing position in the job market. [NCES degree data](https://nces.ed.gov/ipeds/search/viewtable?tableId=36567) and [BLS college enrollment and work activity release](https://www.bls.gov/news.release/pdf/hsgec.pdf)

**Reachability.** Initial participants can be recruited from the project owner's post-graduate cohort, bootcamp and university career communities, alumni groups, and early-career job-search communities. The first five interviews should record role, career stage, target job, current workaround, and consent to use an anonymized quote.

**Decision.** Keep the initial workflow short: resume, target role, review, report, next quests. Do not build a broad job board or generic learning product.

## 3. Size the Market

**Bottom-up market signal.** Atlas does not need a venture-scale market claim for a capstone, but the addressable cohort is recurring and substantial. In the U.S. alone, NCES recorded about 1.97 million bachelor's degrees in 2022-23. The broader early-career and career-transition population is larger than that annual flow; BLS reported 17.4 million people aged 16-24 were not enrolled in school in October 2024. [NCES Fast Facts](https://nces.ed.gov/fastfacts/display.asp?id=372) and [BLS release](https://www.bls.gov/news.release/pdf/hsgec.pdf)

**Category spend.** Resume Worded sells resume review, targeting, and LinkedIn features for $49/month, $99/quarter, or $229/year. Jobscan also offers paid Premium features beyond a limited free scan allowance. These are not Atlas revenue forecasts, but they are observable willingness-to-pay signals for closely related career-preparation work. [Resume Worded Pro pricing](https://resumeworded.com/get-pro) and [Jobscan Premium](https://www.jobscan.co/video-jobscan-premium)

**Decision.** Treat the initial serviceable segment as early-career candidates who will bring a real target role. A free capstone MVP can validate completion and repeat use first; pricing is out of scope.

## 4. Map the Competition

| Alternative | What it does well | Gap Atlas is testing |
| --- | --- | --- |
| ChatGPT or another general LLM | Flexible drafting and conversation. | The user must create the prompt, supply context, evaluate the answer, and maintain a plan themselves. Atlas fixes the workflow around one saved report. |
| Jobscan | Resume-to-job matching, ATS-oriented checks, and missing-keyword feedback. [Product page](https://www.jobscan.co/resume-matcher) | A match score does not by itself create a private 30/60/90-day proof-building campaign with persistent quest progress. |
| Resume Worded | Line-by-line review, targeted resume analysis, and LinkedIn feedback. [Pro features](https://resumeworded.com/get-pro) | It is centered on improving documents; Atlas tests whether candidates value a role-readiness dashboard and next-action plan after the review. |
| Mentors, peers, and career centers | Nuanced human context and accountability. | Advice can be intermittent and difficult to turn into a visible plan between sessions. Atlas is a preparation tool, not a replacement for human advice. |

**Evidence of the gap.** Public discussions about resume match tools include users questioning how a numeric match translates to transferable experience or an actual next step. Treat these posts as qualitative signals, not population estimates. [r/careerguidance discussion](https://www.reddit.com/r/careerguidance/comments/15idul8) and [r/jobsearchhacks discussion](https://www.reddit.com/r/jobsearchhacks/comments/1ksavb3)

**Decision.** Do not compete on ATS simulation, job aggregation, or automated applications. Differentiate on structured readiness evidence plus a completed-action loop.

## 5. Define the Edge and Why Now

**Differentiating angle.** Atlas converts a role-specific review into a persistent career campaign: a user sees matched evidence, prioritized gaps, resume actions, and 30/60/90-day quests. Completing a quest updates private in-app progress, XP, readiness level, and eligible badges. Ask Atlas remains tied to the report instead of becoming a general chatbot.

**Why now.** The World Economic Forum's 2025 report says employers expect 39% of workers' core skills to change by 2030 and identifies skills gaps as a key business-transformation barrier. A role-specific evidence and action loop is more useful when skill expectations shift quickly and candidates need to show proof, not only list credentials. [WEF Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/)

**Defensible edge, not a claim of superiority.** Atlas is narrower than a job-search suite and more structured than a blank chat. Its technical edge for this project is a reviewed document-extraction flow, structured LLM output validation, curated retrieval context, report-scoped follow-up, and private progress tracking. It does not claim a proprietary hiring signal.

## 6. Design a Cheap Test

**Assumption to test.** Candidates will spend 10-15 minutes providing a resume and real target role, then say whether a role-specific action plan is more useful than a score or generic chat response alone.

| Test | Cost and time | Positive result | Evidence captured |
| --- | --- | --- | --- |
| Concierge review with five target users | $0; 30 minutes per user; use the working Atlas flow or a facilitator-run report. | At least 3 of 5 users complete the intake and can name one concrete action they would take in the next week. | Anonymized role, target role, completion status, the selected next action, and one verbatim quote with consent. |
| Landing-page message test | $0; one afternoon; share a short Atlas page with two calls to action: `See my next step` and `Improve my resume`. | At least 10 interested visitors and a clear winning call to action measured by click or form completion. | Source of traffic, visits, CTA clicks, and sign-up/contact count. |
| Follow-up retention check | $0; send one manual follow-up 7 days after the concierge review. | At least 3 of 5 participants report completing, starting, or scheduling a recommended action. | Yes/no status, reason, and what made the action easier or harder. |

**Existing willingness-to-pay evidence.** The paid plans documented in Step 3 show users pay for adjacent resume-review and targeting tools. The tests above validate whether Atlas's differentiated action loop changes behavior; do not claim those results until the test log is complete.

## 7. Stress-Test the Idea

| Risk | Evidence or failure mode | Mitigation and pass condition |
| --- | --- | --- |
| Output feels generic or incorrect | General LLM outputs can be vague, and public discussion of resume match tools shows users can distrust a score that does not reflect their context. | Require reviewed resume text and a role description; use structured output, retrieved guidance, source titles, and a guidance-only disclaimer. Pilot users must rate the next action as specific enough to attempt. |
| Fit score is treated as a hiring prediction | Competing tools prominently use scores, while job outcomes remain uncertain. | Label the score as a readiness estimate, not an ATS or hiring prediction; never tie XP, badges, or quests to interview promises. |
| Sensitive resume data is mishandled | Resumes contain personal data and work history. | Do not store uploaded files or full raw resume text; use Supabase RLS; never add private resumes to the shared RAG index; test cross-user access denial. |
| Document extraction fails | PDF/DOCX resumes vary in structure. | Validate name, type, size, and content signature before extraction; provide an editable review step and a recoverable error with paste-text fallback. |
| Gamification feels childish or unearned | Career preparation is consequential, and public scoring can create pressure. | Keep progression private, use no leaderboards or streak-loss mechanics, and keep the report professional. Pilot users must report that the campaign framing is motivating rather than distracting. |

## Evidence Register and Submission Checklist

| Item | Evidence ready now | Before submitting |
| --- | --- | --- |
| Problem, customer, market, competition, and why now | Public sources linked above, accessed July 2026. | Check links still work and capture screenshots or archived copies if the course requires attachments. |
| Cheap-test behavior evidence | Test design and adjacent paid-category evidence are documented. | Run the five-user concierge test; attach the anonymized result table and at least three consented quotes. |
| Risk evidence | Public category discussions plus technical/privacy risk analysis are documented. | Record any failures or objections from the pilot and update the mitigation row. |
