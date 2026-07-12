"use client";

import { useState } from "react";

interface CopyMarkdownButtonProps {
  markdown: string;
}

// Copies pre-rendered Markdown to the clipboard. Receives the markdown string
// as a prop rather than building it, so this component stays a thin UI
// concern and the (pure, tested) rendering lives in export/markdown.ts.
export function CopyMarkdownButton({ markdown }: CopyMarkdownButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        // Fallback for browsers/contexts without the async Clipboard API.
        const textarea = document.createElement("textarea");
        textarea.value = markdown;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const succeeded = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!succeeded) {
          throw new Error("Fallback copy command failed");
        }
      }
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  const label =
    state === "copied" ? "Copied!" : state === "error" ? "Copy failed" : "Copy as Markdown";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-border-subtle bg-background px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:text-foreground"
    >
      {label}
    </button>
  );
}
