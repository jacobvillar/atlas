import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/core/supabase/server";
import { AnalysisForm } from "@/modules/analysis-workbench/components/analysis-form";

// Protected by proxy.ts (/analysis prefix); this second check is
// defense-in-depth, matching the dashboard page's pattern.
export default async function NewAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-full bg-background-secondary">
      <header className="border-b border-border-subtle bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/atlas-mark.svg" alt="Atlas" width={28} height={28} />
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-foreground-secondary hover:text-foreground"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          New analysis
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Paste your resume and a target job description to get a readiness
          report and roadmap quests.
        </p>

        <div className="mt-8">
          <AnalysisForm />
        </div>
      </main>
    </div>
  );
}
