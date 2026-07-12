import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/privacy", label: "Privacy" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function PublicNav() {
  return (
    <header className="atlas-public-nav">
      <div className="atlas-public-nav__inner">
        <Link href="/" className="atlas-public-nav__brand">
          <Image
            src="/atlas-mark.svg"
            alt="Atlas"
            width={36}
            height={36}
            priority
          />
          <span>
            <strong>Atlas</strong>
            <small>Career campaigns</small>
          </span>
        </Link>

        <nav className="atlas-public-nav__links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="atlas-public-nav__link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="atlas-public-nav__actions">
          <Link href="/login" className="atlas-public-nav__login">
            Login
          </Link>
          <Link href="/signup" className="atlas-public-nav__cta">
            Begin campaign
          </Link>
        </div>
      </div>
    </header>
  );
}
