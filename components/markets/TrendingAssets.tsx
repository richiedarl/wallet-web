import { MiniChart } from "@/components/markets/MiniChart";
import { AssetIcon } from "@/components/markets/AssetIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marketAssets } from "@/lib/crypto/mock-data";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function TrendingAssets() {
  return (
    <section className="section section-border">
      <div className="page-shell">
        <SectionHeading
          eyebrow="In focus"
          title="Assets drawing attention."
          description="A closer look at established networks and the market activity around them."
          link={{ label: "Explore assets", href: "#markets" }}
        />
        <div className="trending-grid">
          {marketAssets.slice(0, 3).map((asset, index) => (
            <article
              className={`trending-card${index === 0 ? " featured" : ""}`}
              key={asset.symbol}
            >
              <div className="trending-top">
                <div className="asset-cell">
                  <AssetIcon symbol={asset.symbol} color={asset.color} />
                  <span>
                    <span className="asset-name">{asset.name}</span>
                    <span className="asset-symbol">{asset.symbol}</span>
                  </span>
                </div>
                <span className="trend-label">{index === 0 ? "Market leader" : "In focus"}</span>
              </div>
              <div className="trending-price">{money.format(asset.price)}</div>
              <span className={asset.change >= 0 ? "trending-change" : "trending-change negative"}>
                {asset.change > 0 ? "+" : ""}
                {asset.change.toFixed(2)}% today
              </span>
              <div className="trending-chart">
                <MiniChart
                  className="trending-svg"
                  values={asset.chart}
                  color={asset.change >= 0 ? "#9aefb3" : "#ff8f91"}
                />
              </div>
              <div className="trending-footer">
                <span>Market cap</span>
                <span>{asset.marketCap}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
