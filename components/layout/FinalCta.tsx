import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WalletButton } from "@/components/wallet/WalletButton";

export function FinalCta() {
  return (
    <section className="page-shell final-cta">
      <div className="cta-panel">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          Start with clarity
        </span>
        <h2>Your next move starts with better information.</h2>
        <p>
          Explore the market, discover new ideas, and make your own decisions
          with a clearer view of the crypto economy.
        </p>
        <div className="cta-actions">
          <Link className="button button-primary" href="#markets">
            Explore Markets
            <ArrowRight aria-hidden="true" />
          </Link>
          <WalletButton />
        </div>
      </div>
    </section>
  );
}
