"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Mirrors apps/web/src/core/validation/analyze.ts bounds so users see
// inline feedback before submitting. The server remains the source of truth.
const RESUME_MIN = 50;
const RESUME_MAX = 20000;
const JD_MIN = 50;
const JD_MAX = 15000;
const TARGET_ROLE_MIN = 3;
const TARGET_ROLE_MAX = 200;

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_EXTENSIONS = [".pdf", ".docx"];
const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// v1 is soft-scoped to AI engineering; offer these as quick picks in
// career-path mode. Users can still type any role.
const AI_ROLE_PRESETS = [
  "AI Engineer",
  "ML Engineer",
  "LLM / Applied-AI Engineer",
  "MLOps Engineer",
];

type Mode = "job_description" | "career_path";

const textareaClass =
  "mt-1 w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none";
const inputClass =
  "mt-1 w-full rounded-md border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none";

interface FieldErrors {
  resumeText?: string;
  jobDescriptionText?: string;
  targetRole?: string;
}

function charCountClass(count: number, min: number, max: number) {
  if (count > 0 && (count < min || count > max)) {
    return "text-red-600";
  }
  return "text-foreground-muted";
}

export function AnalysisForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("job_description");
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeDocumentId, setResumeDocumentId] = useState<string | null>(null);

  const careerPath = mode === "career_path";

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setSubmitError(null);
    // Clear the mode-specific field errors that no longer apply.
    setFieldErrors((prev) => ({
      ...prev,
      jobDescriptionText: undefined,
      targetRole: undefined,
    }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    const trimmedResume = resumeText.trim();
    const trimmedJd = jobDescriptionText.trim();
    const trimmedRole = targetRole.trim();

    if (trimmedResume.length < RESUME_MIN) {
      errors.resumeText = `Add more resume detail (at least ${RESUME_MIN} characters).`;
    } else if (trimmedResume.length > RESUME_MAX) {
      errors.resumeText = `Resume text is too long (max ${RESUME_MAX} characters).`;
    }

    if (careerPath) {
      // Career-path mode: a target role is required; the job description is
      // synthesized server-side, so it is not collected here.
      if (trimmedRole.length < TARGET_ROLE_MIN) {
        errors.targetRole = `Enter a target role (at least ${TARGET_ROLE_MIN} characters).`;
      } else if (trimmedRole.length > TARGET_ROLE_MAX) {
        errors.targetRole = `Target role is too long (max ${TARGET_ROLE_MAX} characters).`;
      }
    } else {
      // Job-description mode: a job description is required; target role is
      // optional.
      if (trimmedJd.length < JD_MIN) {
        errors.jobDescriptionText = `Add more job description detail (at least ${JD_MIN} characters).`;
      } else if (trimmedJd.length > JD_MAX) {
        errors.jobDescriptionText = `Job description is too long (max ${JD_MAX} characters).`;
      }
      if (trimmedRole.length > TARGET_ROLE_MAX) {
        errors.targetRole = `Target role is too long (max ${TARGET_ROLE_MAX} characters).`;
      }
    }

    return errors;
  }

  async function onUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadNotice(null);

    const nameLower = file.name.toLowerCase();
    const extension = ALLOWED_UPLOAD_EXTENSIONS.find((ext) =>
      nameLower.endsWith(ext),
    );
    if (!extension) {
      setUploadNotice("Upload unavailable — paste your resume instead.");
      return;
    }
    const expectedType = MIME_TYPE_BY_EXTENSION[extension];
    if (file.type && file.type !== expectedType) {
      setUploadNotice("Upload unavailable — paste your resume instead.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadNotice("Upload unavailable — paste your resume instead.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setUploadNotice("Upload unavailable — paste your resume instead.");
        return;
      }

      const data = (await response.json()) as {
        text?: string;
        resumeDocumentId?: string;
      };

      if (!data.text) {
        setUploadNotice("Upload unavailable — paste your resume instead.");
        return;
      }

      setResumeText(data.text);
      setResumeDocumentId(data.resumeDocumentId ?? null);
      setFieldErrors((prev) => ({ ...prev, resumeText: undefined }));
      setUploadNotice("Extracted resume text loaded below. Review before analyzing.");
    } catch {
      setUploadNotice("Upload unavailable — paste your resume instead.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const trimmedRole = targetRole.trim();

    // Career-path mode sends the role and omits the job description (the server
    // synthesizes it). Job-description mode sends the JD and an optional role.
    const payload = careerPath
      ? {
          mode,
          resumeText: resumeText.trim(),
          targetRole: trimmedRole,
          ...(resumeDocumentId ? { resumeDocumentId } : {}),
        }
      : {
          mode,
          resumeText: resumeText.trim(),
          jobDescriptionText: jobDescriptionText.trim(),
          ...(trimmedRole ? { targetRole: trimmedRole } : {}),
          ...(resumeDocumentId ? { resumeDocumentId } : {}),
        };

    setSubmitting(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 400) {
        const data = (await response.json()) as {
          error?: string;
          issues?: {
            fieldErrors?: Record<string, string[]>;
          };
        };
        const issues = data.issues?.fieldErrors ?? {};
        setFieldErrors({
          resumeText: issues.resumeText?.[0],
          jobDescriptionText: issues.jobDescriptionText?.[0],
          targetRole: issues.targetRole?.[0],
        });
        setSubmitError(data.error ?? "Please fix the highlighted fields.");
        return;
      }

      if (!response.ok) {
        setSubmitError("Analysis failed. Please try again.");
        return;
      }

      const data = (await response.json()) as { reportId: string };
      router.push(`/reports/${data.reportId}`);
    } catch {
      setSubmitError("Analysis failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const modeButtonClass = (active: boolean) =>
    `flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-accent text-white shadow-sm"
        : "text-foreground-secondary hover:bg-background-tertiary"
    }`;

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <span className="block text-sm font-medium text-foreground">
          How do you want to target this analysis?
        </span>
        <div
          role="tablist"
          aria-label="Analysis input mode"
          className="mt-1 flex gap-1 rounded-lg border border-border-subtle bg-background-secondary p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!careerPath}
            onClick={() => switchMode("job_description")}
            className={modeButtonClass(!careerPath)}
          >
            Paste a job description
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={careerPath}
            onClick={() => switchMode("career_path")}
            className={modeButtonClass(careerPath)}
          >
            Choose a target role
          </button>
        </div>
        <p className="mt-2 text-xs text-foreground-muted">
          {careerPath
            ? "No job posting yet? Atlas builds a representative profile for the role you choose."
            : "Paste a specific job description for the most precise readiness report."}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="resumeText" className="block text-sm font-medium text-foreground">
            Resume
          </label>
          <span className={`text-xs ${charCountClass(resumeText.trim().length, RESUME_MIN, RESUME_MAX)}`}>
            {resumeText.trim().length} / {RESUME_MAX}
          </span>
        </div>
        <textarea
          id="resumeText"
          name="resumeText"
          rows={10}
          value={resumeText}
          onChange={(e) => {
            setResumeText(e.target.value);
            setFieldErrors((prev) => ({ ...prev, resumeText: undefined }));
            setResumeDocumentId(null);
          }}
          placeholder="Paste your resume text here…"
          className={textareaClass}
        />
        {fieldErrors.resumeText ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {fieldErrors.resumeText}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-border-subtle px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary disabled:opacity-60"
          >
            {uploading ? "Extracting…" : "Upload PDF or DOCX instead"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={onUploadChange}
          />
          {uploadNotice ? (
            <span className="text-xs text-foreground-muted">{uploadNotice}</span>
          ) : null}
        </div>
      </div>

      {careerPath ? null : (
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="jobDescriptionText"
              className="block text-sm font-medium text-foreground"
            >
              Job description
            </label>
            <span
              className={`text-xs ${charCountClass(jobDescriptionText.trim().length, JD_MIN, JD_MAX)}`}
            >
              {jobDescriptionText.trim().length} / {JD_MAX}
            </span>
          </div>
          <textarea
            id="jobDescriptionText"
            name="jobDescriptionText"
            rows={10}
            value={jobDescriptionText}
            onChange={(e) => {
              setJobDescriptionText(e.target.value);
              setFieldErrors((prev) => ({ ...prev, jobDescriptionText: undefined }));
            }}
            placeholder="Paste the target job description here…"
            className={textareaClass}
          />
          {fieldErrors.jobDescriptionText ? (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.jobDescriptionText}
            </p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor="targetRole" className="block text-sm font-medium text-foreground">
          Target role{" "}
          {careerPath ? null : (
            <span className="text-foreground-muted">(optional)</span>
          )}
        </label>
        <input
          id="targetRole"
          name="targetRole"
          type="text"
          value={targetRole}
          onChange={(e) => {
            setTargetRole(e.target.value);
            setFieldErrors((prev) => ({ ...prev, targetRole: undefined }));
          }}
          placeholder="e.g. AI Engineer"
          className={inputClass}
        />
        {careerPath ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {AI_ROLE_PRESETS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setTargetRole(role);
                  setFieldErrors((prev) => ({ ...prev, targetRole: undefined }));
                }}
                className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary"
              >
                {role}
              </button>
            ))}
          </div>
        ) : null}
        {fieldErrors.targetRole ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {fieldErrors.targetRole}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Analyzing… ~20s" : "Generate readiness report"}
      </button>

      <p className="text-xs text-foreground-muted">
        Resume files and full raw resume text are not stored. Atlas saves your
        report, target role, and structured resume evidence. The fit score is
        guidance, not a hiring prediction.
      </p>
    </form>
  );
}
