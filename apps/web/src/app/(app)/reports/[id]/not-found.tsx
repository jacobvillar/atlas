import Image from "next/image";
import Link from "next/link";

// Rendered by notFound() when a report id doesn't exist or isn't owned by the
// current user (RLS makes those two cases indistinguishable, by design).
export default function ReportNotFound() {
  return (
    <div className="min-h-full bg-background-secondary">
      <header className="border-b border-border-subtle bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/atlas-mark.svg" alt="Atlas" width={28} height={28} />
            <span className="text-sm font-semibold text-foreground">Atlas</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Report not found
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          This report doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Back to dashboard
        </Link>
      </main>
    </div>
  );
}
