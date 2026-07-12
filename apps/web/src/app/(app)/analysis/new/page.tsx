import { redirect } from "next/navigation";
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
  );
}
