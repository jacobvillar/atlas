# Public Site

Atlas needs a small public site so the deployed app feels complete before login. This should support the capstone demo without distracting from the authenticated AI workflow.

## Navigation

Top navigation:

- Home
- Use Cases
- Privacy
- FAQ
- About
- Login
- Sign up for free

Primary CTA: `Sign up for free`

Secondary CTA: `Login`

## Logo

Use the Atlas logo assets:

- Full logo: `docs/assets/atlas-logo.svg`
- Compact mark: `docs/assets/atlas-mark.svg`

The logo concept is a compass route mark with small checkpoints. It reinforces the product promise: users are not guaranteed a job, but they receive clearer direction and trackable career quests for the next move.

## Pages

### Home

Route: `/`

Purpose: Explain Atlas quickly and move users toward signup.

Recommended sections:

- Hero with logo, tagline, and product promise.
- Product workflow: upload resume, paste job description, get readiness dashboard, complete roadmap quests.
- Dashboard preview section showing score, strengths, gaps, progress, and 30/60/90 roadmap quests.
- Trust/privacy strip: no uploaded resume file storage, private reports, user-owned data.
- CTA: Sign up for free.

Hero copy:

```text
Atlas
Map your next career move.
Compare your resume to a real target role and turn the gaps into practical 30/60/90-day career quests.
```

### Use Cases

Route: `/use-cases`

Purpose: Show who Atlas helps without narrowing the product to tech-only roles.

Recommended use cases:

- Fresh graduates preparing for first professional roles.
- Early-career professionals applying for their next step.
- Career shifters translating training, projects, and certificates into a stronger narrative.
- Bootcamp and post-grad learners turning coursework into role-ready evidence.
- Advisors or mentors helping a learner review career readiness.

Each use case should show:

- User situation.
- What the user uploads or pastes.
- What Atlas returns.
- Example output: readiness summary, gap, or roadmap quest.

### Privacy

Route: `/privacy`

Purpose: Make trust visible before signup.

Recommended commitments:

- We do not store uploaded resume files in v1.
- We do not store full raw resume text in v1.
- Reports and Ask Atlas messages belong to the authenticated user.
- Private resumes are not added to the shared RAG knowledge base.
- AI output is guidance, not a hiring decision or guarantee.
- Users should remove highly sensitive personal data before uploading a resume.

This page is a plain-language product privacy page, not a full legal privacy policy.

### FAQ

Route: `/faq`

Purpose: Answer practical questions before login.

Initial questions:

- What is Atlas?
- Who is Atlas for?
- What file types can I upload?
- Does Atlas apply to non-tech jobs?
- Is the fit score a hiring prediction?
- Does Atlas store my resume?
- Can I ask follow-up questions?
- Is Atlas like Duolingo for careers?
- What AI models does Atlas use?
- What is RAG in this project?
- Is Atlas free?

Suggested answer for `Is Atlas like Duolingo for careers?`:

```text
Atlas uses lightweight roadmap quests to make career preparation easier to act on, but it is not a daily lesson game. There are no leaderboards, XP systems, or streak pressure in v1.
```

### About

Route: `/about`

Purpose: Explain the project and the product point of view.

Recommended sections:

- Why Atlas exists.
- The problem: career advice is often generic, and users struggle to turn resume feedback into a concrete plan.
- The product belief: career guidance should be structured, private, and actionable.
- How Atlas works at a high level.
- Academic/project note: Atlas is a post-graduate AI web application capstone project.

Avoid mentioning Better-ed directly on the page. It can remain an internal inspiration, not public positioning.

## Public Site Module

Add a `public-site` module to the web app:

```text
apps/web/src/modules/public-site/
  components/
    public-nav.tsx
    public-footer.tsx
    hero-section.tsx
    workflow-section.tsx
    trust-strip.tsx
  content/
    faq.ts
    use-cases.ts
  index.ts
```

Routes live in the Next.js app directory:

```text
apps/web/src/app/page.tsx
apps/web/src/app/use-cases/page.tsx
apps/web/src/app/privacy/page.tsx
apps/web/src/app/faq/page.tsx
apps/web/src/app/about/page.tsx
apps/web/src/app/(auth)/login/page.tsx
apps/web/src/app/(auth)/signup/page.tsx
```

## Auth Entry Pages

Login and signup should feel as simple as the public site, not like a separate admin tool. Use the same logo, restrained blue CTA, soft gray background, and concise copy.

Login page copy:

```text
Welcome back
Continue your career roadmap.
```

Signup page copy:

```text
Start mapping your next career move
Create a free account to save reports, quests, and Ask Atlas chats.
```

Auth page requirements:

- Keep one clear primary action per page.
- Link between login and signup.
- Show plain validation errors near the form.
- Route authenticated users to `/dashboard`.
- Do not use streak, XP, mascot, leaderboard, or social-pressure language on auth pages.
- Keep privacy reassurance visible but short: `Your resume files are not stored in Atlas v1.`

## Design Rules

- The first viewport should clearly show the Atlas brand and career-navigation promise.
- Use the product UI preview as the main visual asset, not an abstract illustration.
- Keep pages concise. The authenticated dashboard is the real product.
- Do not use copied Better-ed copy, screenshots, testimonials, compliance claims, or page claims.
- If comparing to learning apps, explain that Atlas uses lightweight roadmap quests but does not include streaks, XP, leaderboards, or daily lessons in v1.
- Use restrained blue accents, white/soft gray backgrounds, thin borders, and compact professional typography.
