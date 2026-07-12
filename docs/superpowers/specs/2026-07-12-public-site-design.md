# Atlas Public Site Design

## Goal

Add a small public site before the authenticated Atlas app. The site should explain the product, build trust, and route users to login or signup without becoming a large marketing project.

## Navigation

Public navigation:

- Home
- Use Cases
- Privacy
- FAQ
- About
- Login
- Sign up for free

`Sign up for free` is the primary CTA. `Login` is secondary.

## Routes

- `/`: home page.
- `/use-cases`: user scenarios.
- `/privacy`: plain-language privacy commitments.
- `/faq`: practical questions.
- `/about`: project mission and capstone context.
- `/login`: Supabase login.
- `/signup`: Supabase signup.

## Brand

Use the Atlas brand:

- Name: Atlas.
- Tagline: Map your next career move.
- Full logo: `docs/assets/atlas-logo.svg`.
- Compact mark: `docs/assets/atlas-mark.svg`.
- Palette: white, soft gray, restrained blue, dark text.

## Home Page

The first viewport should show:

- Atlas logo.
- Headline: `Map your next career move.`
- Supporting copy: `Compare your resume to a real target role and turn the gaps into practical 30/60/90-day career quests.`
- Primary CTA: `Sign up for free`.
- Secondary CTA: `Login`.
- Product preview showing readiness score, strengths, gaps, quest progress, and roadmap quests.

Sections:

1. Hero.
2. Workflow: upload resume, paste job description, review dashboard, complete roadmap quests.
3. Dashboard preview.
4. Trust strip.
5. Final CTA.

## Use Cases Page

Use cases:

- Fresh graduates.
- Early-career professionals.
- Career shifters.
- Bootcamp and post-grad learners.
- Advisors and mentors.

Each use case should describe the situation, input, and Atlas output.

## Privacy Page

State plain-language commitments:

- Atlas does not store uploaded resume files in v1.
- Atlas does not store full raw resume text in v1.
- Reports and Ask Atlas messages belong to the authenticated user.
- Private resumes are not added to the shared RAG knowledge base.
- AI output is guidance, not a hiring guarantee.

## FAQ Page

Initial FAQ:

- What is Atlas?
- Who is Atlas for?
- What file types can I upload?
- Does Atlas support non-tech jobs?
- Is the fit score a hiring prediction?
- Does Atlas store my resume?
- Can I ask follow-up questions?
- Is Atlas like Duolingo for careers?
- What AI models does Atlas use?
- What is RAG in this project?
- Is Atlas free?

## About Page

Explain:

- Why Atlas exists.
- The problem with generic career advice.
- The belief that career guidance should be structured, private, and actionable.
- How Atlas works at a high level.
- That Atlas is a post-graduate AI web application capstone project.

Do not mention Better-ed directly on the public page.

## Login And Signup Pages

Auth entry should be low-friction, calm, and consistent with the public site. The user should understand immediately that creating an account lets them save reports, roadmap quests, and Ask Atlas conversations.

Login page:

- Heading: `Welcome back`.
- Supporting copy: `Continue your career roadmap.`
- Primary CTA: `Login`.
- Secondary link: `Need an account? Sign up for free.`

Signup page:

- Heading: `Start mapping your next career move`.
- Supporting copy: `Create a free account to save reports, quests, and Ask Atlas chats.`
- Primary CTA: `Sign up for free`.
- Secondary link: `Already have an account? Login.`

Shared auth requirements:

- Use the Atlas logo or compact mark.
- Use one focused form per page.
- Keep validation messages plain and close to the relevant field.
- Route authenticated users to `/dashboard`.
- Include a short privacy reassurance: `Your resume files are not stored in Atlas v1.`
- Do not introduce streaks, XP, leaderboards, mascots, or daily-challenge language.

## Acceptance Criteria

- Public nav shows Home, Use Cases, Privacy, FAQ, About, Login, and Sign up for free.
- Home page has a clear Atlas brand signal in the first viewport.
- Public pages use Atlas brand guidelines.
- Public copy avoids hiring guarantees.
- Privacy page mentions resume file and raw text non-storage.
- Login and signup links route to auth pages.
- Login and signup pages use Atlas-specific copy and route authenticated users to `/dashboard`.
- Authenticated dashboard remains the main product experience.
