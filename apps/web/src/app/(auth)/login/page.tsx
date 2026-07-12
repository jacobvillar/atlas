import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login — Atlas",
  description: "Continue your career roadmap.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background-secondary px-6 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border-subtle bg-background p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/atlas-mark.svg" alt="Atlas" width={32} height={32} />
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Continue your career roadmap.
        </p>

        <LoginForm redirectTo={redirectTo} />

        <p className="mt-6 text-sm text-foreground-secondary">
          Need an account?{" "}
          <Link href="/signup" className="text-accent hover:text-accent-hover">
            Sign up for free.
          </Link>
        </p>

        <p className="mt-4 text-xs text-foreground-muted">
          Your resume files are not stored in Atlas v1.
        </p>
      </div>
    </div>
  );
}
