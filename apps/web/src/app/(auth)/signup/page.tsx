import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/modules/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up — Atlas",
  description: "Create a free account to save reports, quests, and Ask Atlas chats.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background-secondary px-6 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border-subtle bg-background p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/atlas-mark.svg" alt="Atlas" width={32} height={32} />
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Start mapping your next career move
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          Create a free account to save reports, quests, and Ask Atlas
          chats.
        </p>

        <SignupForm />

        <p className="mt-6 text-sm text-foreground-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Login.
          </Link>
        </p>

        <p className="mt-4 text-xs text-foreground-muted">
          Your resume files are not stored in Atlas v1.
        </p>
      </div>
    </div>
  );
}
