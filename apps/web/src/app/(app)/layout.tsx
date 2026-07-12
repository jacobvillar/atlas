import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/core/supabase/server";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { AppNav } from "@/modules/career-dashboard/components/app-nav";

// Persistent app shell for the authenticated area. Individual pages under
// (app) no longer render their own header — this layout owns the brand, the
// nav tabs, and the user identity / sign-out controls so the authenticated
// area feels like one app. Auth gating itself lives in proxy.ts and each
// page's own defense-in-depth check; this layout is navigation chrome only.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS scopes this to the authenticated user; the latest report drives the
  // Quests / Ask Atlas tab destinations. Null when the user has no reports yet.
  const { data: reports } = await supabase
    .from("career_reports")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1);

  const latestReportId = (reports?.[0]?.id as string | undefined) ?? null;

  return (
    <div className="flex min-h-full flex-col bg-background-secondary">
      <header className="border-b border-border-subtle bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/atlas-mark.svg" alt="Atlas" width={28} height={28} />
              <span className="text-sm font-semibold text-foreground">
                Atlas
              </span>
            </Link>
            <AppNav latestReportId={latestReportId} />
          </div>
          <div className="flex items-center gap-4">
            {user?.email ? (
              <span className="hidden text-sm text-foreground-muted sm:inline">
                {user.email}
              </span>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
