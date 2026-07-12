# Atlas Demo Script (2 Minutes)

Live app: <https://atlas-wheat-iota.vercel.app/>

Use a sanitized PDF resume and a real target job description. Record a **first-time user** account so the dashboard begins with no reports or quests. Keep the browser at 100% zoom, close unrelated tabs, and do not show passwords, API keys, database screens, or personal contact information.

## 0:00-0:15 - Login and Empty Dashboard

> Welcome to Atlas: a gamified AI career-readiness coach that helps job seekers map their next career move. Atlas turns a resume and a target role into clear AI insights, practical recommendations, and a personalized career roadmap.

> For this MVP, the core capabilities are secure user login, PDF resume extraction, AI-powered resume-to-role analysis, readiness insights, targeted recommendations, and generated roadmap quests. I will show the full journey for a first-time user.

Log in, then pause on the dashboard. Point out **You have no reports yet** and that the quest preview is empty.

> Because this is a first-time user, there are no reports, recommendations, or quests yet. Atlas starts with the user's own resume and target role instead of a generic career plan.

Click **Start a new analysis**.

## 0:15-0:40 - PDF Upload and AI Extraction

> I begin by uploading a PDF resume. Atlas sends it to a private document-extraction service, which converts it into editable text for review. The uploaded file itself is not retained as part of the report.

Choose the sanitized PDF. While **Extracting...** is visible, say:

> This is the first AI-assisted step: Atlas reads the document and loads the extracted resume text below, so the user can review or correct it before any analysis happens.

Show the **Extracted resume text loaded below** notice and briefly scroll through the populated resume field.

## 0:40-0:55 - Target Role and Analysis Request

> Next, I paste a target job description. This gives the AI a concrete role to compare against the resume, rather than generating broad advice.

Show the target job description and optional target-role field. Click **Generate readiness report** and show the **Analyzing...** state.

## 0:55-1:35 - AI Insights and Recommendations

> Atlas now analyzes the reviewed resume against the role requirements and returns a structured readiness report. The result identifies evidence already present in the resume, the most important gaps, and practical recommendations the user can act on.

Show the report in this order, spending only a few seconds on each:

1. The readiness score and guidance disclaimer.
2. Matched strengths or evidence from the resume.
3. Priority gaps relative to the target role.
4. Resume improvements and specific next-step recommendations.

> The score is preparation guidance, not a hiring prediction. The value is in the explanation: what the user already demonstrates, what is missing for this role, and the clearest next actions.

## 1:35-1:50 - Recommendations Become a Plan

> After the AI report is generated, Atlas creates personalized roadmap quests from the priority gaps. This is why the dashboard started empty: the first recommendations and quests are created from this user's actual analysis.

Show the generated roadmap section or return to the dashboard to show that the empty state now contains the first report and quest preview. Do not spend time completing a quest in this recording.

## 1:50-2:00 - Close and Next Enhancements

> Atlas combines secure login, PDF extraction, and structured AI analysis to turn a resume and a target role into understandable insights and practical recommendations. It is built with Next.js, Supabase, OpenAI, and a separate Python extraction service.

> Next, I would grow Atlas with a stronger recommendation engine that adapts to each user's goals and progress, plus a richer gamified interface with clearer milestones, rewards, and momentum. With explicit user permission, future agentic tools could also connect to career resources - such as job-market research and LinkedIn profile insights - to help users turn recommendations into well-informed actions. Thank you.

End on the readiness report or the newly populated dashboard. Keep the recording below two minutes; the repository contains the architecture, tests, and implementation details.
