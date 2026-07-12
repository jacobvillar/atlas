import Link from "next/link";

const footerLinks = [
  { href: "/use-cases", label: "Use Cases" },
  { href: "/privacy", label: "Privacy" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border-subtle bg-background-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-foreground-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} Atlas. Map your next career
          move.
        </p>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
