import { Eye, Fingerprint, KeyRound, ScanLine } from "lucide-react";

const trustPrinciples = [
  {
    title: "Wallet-based access",
    detail: "Connect a wallet to view assets without handing over custody.",
    icon: Fingerprint,
  },
  {
    title: "Your keys, your control",
    detail: "Your wallet remains yours. NOVA never asks for your recovery phrase.",
    icon: KeyRound,
  },
  {
    title: "Transparent transactions",
    detail: "Review network details and confirm activity directly in your wallet.",
    icon: ScanLine,
  },
  {
    title: "Portfolio clarity",
    detail: "Understand asset balances and allocation in a single view.",
    icon: Eye,
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="section section-border">
      <div className="page-shell trust-layout">
        <div className="trust-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Control stays with you
          </span>
          <h2>Your keys. Your assets. Your call.</h2>
          <p>
            NOVA is designed to help you see more clearly without taking control
            away from you. Connect your wallet when you choose, and review every
            transaction before it happens.
          </p>
        </div>
        <div className="trust-list">
          {trustPrinciples.map(({ title, detail, icon: Icon }) => (
            <article className="trust-item" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
