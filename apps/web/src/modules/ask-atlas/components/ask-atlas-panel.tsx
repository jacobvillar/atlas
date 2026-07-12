"use client";

import { useState } from "react";
import { ReportSection } from "@/modules/readiness-report/components/report-section";
import type { AskMessage } from "../queries/get-messages";

const MAX_QUESTION_LENGTH = 1000;

interface AskAtlasPanelProps {
  reportId: string;
  initialMessages: AskMessage[];
}

interface DisplayMessage {
  key: string;
  role: "user" | "assistant";
  content: string;
}

// Ask Atlas follow-up chat (ATLAS-010). One question at a time: the input is
// disabled while a request is in flight. On success the question and the
// returned answer are appended locally; answers are guidance grounded in the
// user's own saved report. Nothing here embeds or writes into the shared RAG.
export function AskAtlasPanel({ reportId, initialMessages }: AskAtlasPanelProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>(() =>
    initialMessages.map((m) => ({ key: m.id, role: m.role, content: m.content })),
  );
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = question.trim();
  const canSubmit = !pending && trimmed.length >= 3;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const asked = trimmed;
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, question: asked }),
      });

      const data = (await response.json().catch(() => null)) as
        | { answer?: string; error?: string }
        | null;

      if (!response.ok || !data?.answer) {
        setError(
          data?.error ?? "Ask Atlas could not answer right now. Please try again.",
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        { key: `${Date.now()}-user`, role: "user", content: asked },
        { key: `${Date.now()}-assistant`, role: "assistant", content: data.answer! },
      ]);
      setQuestion("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <ReportSection
      id="ask-atlas"
      className="scroll-mt-20"
      title="Ask Atlas"
      description="Ask a follow-up question about this report. Answers are guidance, grounded in your report."
    >
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="text-sm text-foreground-muted">
            No questions yet. Ask about your gaps, a roadmap quest, or how to
            strengthen your resume for this role.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => (
              <li
                key={message.key}
                className={
                  message.role === "user"
                    ? "rounded-lg bg-background-secondary px-4 py-3"
                    : "rounded-lg border border-border-subtle bg-background px-4 py-3"
                }
              >
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {message.role === "user" ? "You" : "Atlas"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground-secondary">
                  {message.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={MAX_QUESTION_LENGTH}
            rows={3}
            disabled={pending}
            placeholder="Ask a follow-up question about this report…"
            className="w-full resize-y rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-foreground-muted">
              {question.length}/{MAX_QUESTION_LENGTH}
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Asking…" : "Ask Atlas"}
            </button>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </ReportSection>
  );
}
