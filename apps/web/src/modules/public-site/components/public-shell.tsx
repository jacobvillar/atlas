import type { ReactNode } from "react";
import { PublicFooter } from "./public-footer";
import { PublicNav } from "./public-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
