"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Orbit, Search, X } from "lucide-react";
import { brand } from "@/lib/brand";
import { WalletButton } from "@/components/wallet/WalletButton";

const navigation = [
  { label: "Markets", href: "#markets" },
  { label: "Explore", href: "#explore" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Insights", href: "#insights" },
  { label: "Sign in", href: "/login" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <Link className="brand-lockup" href="#" aria-label={`${brand.name} home`}>
          <span className="brand-mark">
            <Orbit aria-hidden="true" />
          </span>
          {brand.name}
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="#markets" aria-label="Search markets">
            <Search aria-hidden="true" />
          </Link>
          <WalletButton />
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
