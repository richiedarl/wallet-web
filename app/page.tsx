import { EcosystemExplorer } from "@/components/explore/EcosystemExplorer";
import { FinalCta } from "@/components/layout/FinalCta";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { InsightsSection } from "@/components/insights/InsightsSection";
import { MarketOverview } from "@/components/markets/MarketOverview";
import { TrendingAssets } from "@/components/markets/TrendingAssets";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { TrustSection } from "@/components/trust/TrustSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MarketOverview />
        <TrendingAssets />
        <PortfolioPreview />
        <EcosystemExplorer />
        <InsightsSection />
        <TrustSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
