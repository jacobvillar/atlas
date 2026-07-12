"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-md border border-border-subtle px-3 py-1.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary disabled:opacity-60"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
