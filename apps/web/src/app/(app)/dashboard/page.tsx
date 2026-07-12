import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/core/supabase/server";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";

// Protected by proxy.ts; this second check is defense-in-depth and gives us the
// authenticated user for the greeting.
export default async function DashboardPage() {
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/atlas-mark.svg" alt="Atlas" width={28} height={28} />
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-muted">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your career dashboard
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Start a new analysis to compare your resume against a target role and
          map your next move.
        </p>

        <div className="mt-8 rounded-lg border border-border-subtle bg-background p-8 text-center">
          <p className="text-sm text-foreground-secondary">
            You have no reports yet. Analysis, reports, and roadmap quests arrive
            in the next slices.
          </p>
        </div>
      </main>
    </div>
  );
}
