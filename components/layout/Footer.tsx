import Link from "next/link";
import { CodeXml, Orbit } from "lucide-react";
import { brand } from "@/lib/brand";

const footerLinks = [
  { label: "Markets", href: "#markets" },
  { label: "Explore", href: "#explore" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Insights", href: "#insights" },
  { label: "Learn", href: "#insights" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand-lockup" href="#" aria-label={`${brand.name} home`}>
              <span className="brand-mark">
                <Orbit aria-hidden="true" />
              </span>
              {brand.name}
            </Link>
            <p>Clarity for the crypto economy. Your assets, your decisions.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="footer-socials" aria-label="Social links">
            <a href="https://x.com" aria-label="NOVA on X">
              <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 650 }}>𝕏</span>
            </a>
            <a href="https://github.com" aria-label="NOVA on GitHub">
              <CodeXml aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 {brand.name}. Illustrative information only.</span>
          <div className="footer-legal">
            <Link href="#trust">Terms</Link>
            <Link href="#trust">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
