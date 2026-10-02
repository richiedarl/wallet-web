"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { heroChart } from "@/lib/crypto/mock-data";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function HeroDashboard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="dashboard-frame"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="dashboard-topline">
        <span className="dashboard-label">Market snapshot</span>
        <span className="live-indicator">
          <span className="eyebrow-dot" />
          Market overview
        </span>
      </div>
      <div className="dashboard-stats">
        <div className="dashboard-stat">
          <span className="stat-label">
            <span className="asset-orb orb-btc">₿</span> Bitcoin
          </span>
          <strong className="stat-value">$112,482.31</strong>
          <span className="stat-change">+4.82%</span>
        </div>
        <div className="dashboard-stat">
          <span className="stat-label">
            <span className="asset-orb orb-eth">◆</span> Ethereum
          </span>
          <strong className="stat-value">$4,281.72</strong>
          <span className="stat-change">+2.41%</span>
        </div>
        <div className="dashboard-stat">
          <span className="stat-label">
            <span className="asset-orb orb-portfolio">↗</span> Portfolio
          </span>
          <strong className="stat-value">$84,291.40</strong>
          <span className="stat-change">+8.32%</span>
        </div>
      </div>
      <div className="dashboard-chart">
        <div className="chart-heading">
          <div>
            <strong>$112,482.31</strong>
            <small>Bitcoin · BTC</small>
          </div>
          <div className="chart-range" aria-label="Chart period">
            <span>1H</span>
            <span className="active">24H</span>
            <span>1W</span>
            <span>1M</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={heroChart} margin={{ top: 8, right: 5, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9aefb3" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#9aefb3" stopOpacity={0} />
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
                domain={["dataMin - 1800", "dataMax + 900"]}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid rgba(219,237,225,.12)",
                  borderRadius: 9,
                  background: "#111914",
                  color: "#eff8f1",
                  fontSize: 11,
                }}
                formatter={(value) => [currency.format(Number(value)), "BTC"]}
                labelStyle={{ color: "#859189", marginBottom: 4 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9aefb3"
                strokeWidth={2}
                fill="url(#heroArea)"
                isAnimationActive={!reduceMotion}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-foot">
        <span>Illustrative market data</span>
        <span>Updated just now</span>
      </div>
    </motion.div>
  );
}
