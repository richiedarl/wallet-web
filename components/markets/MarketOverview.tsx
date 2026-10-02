import { AssetIcon } from "@/components/markets/AssetIcon";
import { MiniChart } from "@/components/markets/MiniChart";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marketAssets } from "@/lib/crypto/mock-data";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function MarketOverview() {
  return (
    <section id="markets" className="section section-border">
      <div className="page-shell">
        <SectionHeading
          eyebrow="The market, in focus"
          title="A clearer view of the market."
          description="Track the assets and signals that matter, with a focused snapshot of the broader digital asset economy."
          link={{ label: "View all markets", href: "#markets" }}
        />
        <div className="market-panel">
          <table className="market-table">
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Price</th>
                <th scope="col">24h change</th>
                <th scope="col">Last 7 days</th>
                <th scope="col">Market cap</th>
              </tr>
            </thead>
            <tbody>
              {marketAssets.map((asset) => (
                <tr key={asset.symbol}>
                  <td>
                    <div className="asset-cell">
                      <AssetIcon symbol={asset.symbol} color={asset.color} />
                      <span>
                        <span className="asset-name">{asset.name}</span>
                        <span className="asset-symbol">{asset.symbol}</span>
                      </span>
                    </div>
                  </td>
                  <td>{money.format(asset.price)}</td>
                  <td className={asset.change >= 0 ? "positive" : "negative"}>
                    {asset.change > 0 ? "+" : ""}
                    {asset.change.toFixed(2)}%
                  </td>
                  <td>
                    <MiniChart
                      className="table-sparkline"
                      values={asset.chart}
                      color={asset.change >= 0 ? "#9aefb3" : "#ff8f91"}
                    />
                  </td>
                  <td>{asset.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="market-tiles">
          {marketAssets.map((asset) => (
            <article className="market-tile" key={asset.symbol}>
              <div className="tile-top">
                <div className="asset-cell">
                  <AssetIcon symbol={asset.symbol} color={asset.color} small />
                  <span>
                    <span className="asset-name">{asset.name}</span>
                    <span className="asset-symbol">{asset.symbol}</span>
                  </span>
                </div>
                <span className={asset.change >= 0 ? "positive" : "negative"}>
                  {asset.change > 0 ? "+" : ""}
                  {asset.change.toFixed(2)}%
                </span>
              </div>
              <div className="tile-price">{money.format(asset.price)}</div>
              <div className="tile-bottom">
                <span className="tile-meta">Cap {asset.marketCap}</span>
                <MiniChart
                  className="table-sparkline"
                  values={asset.chart}
                  color={asset.change >= 0 ? "#9aefb3" : "#ff8f91"}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
