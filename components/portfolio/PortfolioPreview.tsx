"use client";

import { useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Info } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { portfolioAllocations, portfolioChart } from "@/lib/crypto/mock-data";

export function PortfolioPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="portfolio" className="section section-border portfolio-section">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Your portfolio"
          title="The whole picture, at a glance."
          description="See how your digital assets are moving together, with a clear view of the detail behind your balance."
        />
        <div className="portfolio-layout">
          <div className="portfolio-chart-card">
            <div className="portfolio-summary">
              <div>
                <span className="balance-label">Total balance</span>
                <strong className="balance-value">$84,291.40</strong>
                <div className="balance-change">
                  <ArrowUpRight aria-hidden="true" size={13} /> +$3,842.21 (8.32%) today
                </div>
              </div>
              <div className="period-select" aria-label="Portfolio chart period">
                <span>1W</span>
                <span>1M</span>
                <span className="selected">1Y</span>
                <span>ALL</span>
              </div>
            </div>
            <div className="portfolio-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={portfolioChart}
                  margin={{ top: 14, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9aefb3" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#9aefb3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(215, 234, 221, 0.07)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718078", fontSize: 9 }}
                    interval={3}
                  />
                  <YAxis
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718078", fontSize: 9 }}
                    tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
                    domain={["dataMin - 5000", "dataMax + 3000"]}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid rgba(219,237,225,.12)",
                      borderRadius: 9,
                      background: "#111914",
                      color: "#eff8f1",
                      fontSize: 11,
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Balance"]}
                    labelStyle={{ color: "#859189", marginBottom: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9aefb3"
                    strokeWidth={2}
                    fill="url(#portfolioArea)"
                    isAnimationActive={!reduceMotion}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <aside className="allocation-card">
            <h3 className="card-title">Asset allocation</h3>
            <p className="allocation-subtitle">Portfolio composition by value</p>
            <div className="allocation-track" aria-label="Portfolio allocation">
              {portfolioAllocations.map((asset) => (
                <span
                  key={asset.name}
                  className="allocation-segment"
                  style={{ width: `${asset.share}%`, background: asset.color }}
                  title={`${asset.name}: ${asset.share}%`}
                />
              ))}
            </div>
            {portfolioAllocations.map((asset) => (
              <div className="allocation-row" key={asset.name}>
                <span className="allocation-name">
                  <span className="allocation-dot" style={{ background: asset.color }} />
                  {asset.name}
                </span>
                <strong>{asset.share}%</strong>
              </div>
            ))}
            <div className="allocation-footnote">
              <Info aria-hidden="true" />
              Example portfolio view. Balances and allocations are illustrative.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
