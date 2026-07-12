import Link from "next/link";

const footerLinks = [
  { href: "/use-cases", label: "Use Cases" },
  { href: "/privacy", label: "Privacy" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function PublicFooter() {
  return (
    <footer className="atlas-public-footer">
      <div className="atlas-public-footer__inner">
        <div>
          <p className="atlas-public-footer__eyebrow">ATLAS CAREER CAMPAIGNS</p>
          <p className="atlas-public-footer__message">Small missions. Real evidence. Your next move.</p>
        </div>
        <nav className="atlas-public-footer__links" aria-label="Footer navigation">
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
        <p className="atlas-public-footer__copyright">&copy; {new Date().getFullYear()} Atlas</p>
      </div>
    </footer>
  );
}
