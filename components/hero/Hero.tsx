import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HeroDashboard } from "@/components/hero/HeroDashboard";
import { WalletButton } from "@/components/wallet/WalletButton";
import { brand } from "@/lib/brand";

export function Hero() {
  return (
    <section className="hero page-shell" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            {brand.tagline}
          </span>
          <h1 id="hero-title">
            Navigate crypto
            <br />
            with <span>more clarity.</span>
          </h1>
          <p className="hero-copy">
            Discover digital assets, follow the signals behind the market, and
            see your portfolio in one considered space.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#markets">
              Explore Markets
              <ArrowRight aria-hidden="true" />
            </Link>
            <WalletButton />
          </div>
          <div className="hero-note">
            <ShieldCheck aria-hidden="true" />
            Market data is illustrative. Your assets stay in your wallet.
          </div>
        </div>
        <HeroDashboard />
      </div>
      <div className="trust-chips" aria-label="Platform principles">
        <span className="trust-chip">Built for self-custody</span>
        <span className="trust-chip">Transparent on-chain activity</span>
        <span className="trust-chip">One view of a changing market</span>
      </div>
    </section>
  );
}
