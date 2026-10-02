export type MarketAsset = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
  color: string;
  chart: number[];
};

export const marketAssets: MarketAsset[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 112482.31,
    change: 4.82,
    marketCap: "$2.23T",
    color: "#efa94c",
    chart: [15, 19, 17, 25, 22, 31, 27, 40, 35, 45, 43, 51, 47, 58, 54, 64],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 4281.72,
    change: 2.41,
    marketCap: "$515.8B",
    color: "#b6bde1",
    chart: [39, 31, 38, 27, 33, 41, 35, 45, 40, 48, 43, 53, 49, 60, 54, 62],
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 198.64,
    change: 6.18,
    marketCap: "$94.2B",
    color: "#9ce7c1",
    chart: [13, 17, 14, 25, 20, 31, 27, 39, 33, 45, 40, 55, 50, 63, 58, 71],
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: 694.83,
    change: -0.73,
    marketCap: "$101.6B",
    color: "#efce67",
    chart: [62, 59, 64, 51, 56, 46, 51, 44, 49, 37, 43, 39, 44, 33, 37, 31],
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 2.84,
    change: 1.96,
    marketCap: "$164.1B",
    color: "#a7b4bc",
    chart: [22, 27, 21, 31, 26, 36, 32, 40, 36, 48, 42, 53, 48, 57, 53, 62],
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.92,
    change: -1.21,
    marketCap: "$32.4B",
    color: "#71a8e6",
    chart: [66, 59, 63, 52, 57, 49, 54, 42, 48, 39, 44, 35, 40, 31, 35, 27],
  },
];

export const heroChart = [
  { date: "09:00", value: 105800 },
  { date: "10:00", value: 106450 },
  { date: "11:00", value: 106120 },
  { date: "12:00", value: 107300 },
  { date: "13:00", value: 106950 },
  { date: "14:00", value: 108240 },
  { date: "15:00", value: 107800 },
  { date: "16:00", value: 109150 },
  { date: "17:00", value: 108720 },
  { date: "18:00", value: 110040 },
  { date: "19:00", value: 109720 },
  { date: "20:00", value: 111280 },
  { date: "21:00", value: 110930 },
  { date: "22:00", value: 112482 },
];

export const portfolioChart = [
  { date: "Jun 10", value: 64700 },
  { date: "Jun 12", value: 67300 },
  { date: "Jun 14", value: 66100 },
  { date: "Jun 16", value: 69200 },
  { date: "Jun 18", value: 67800 },
  { date: "Jun 20", value: 71800 },
  { date: "Jun 22", value: 70100 },
  { date: "Jun 24", value: 74700 },
  { date: "Jun 26", value: 73100 },
  { date: "Jun 28", value: 77900 },
  { date: "Jun 30", value: 75800 },
  { date: "Jul 02", value: 80300 },
  { date: "Jul 04", value: 78200 },
  { date: "Jul 06", value: 84291 },
];

export const portfolioAllocations = [
  { name: "Bitcoin", share: 48, value: "$40,459", color: "#e9a34b" },
  { name: "Ethereum", share: 29, value: "$24,444", color: "#9aa7dd" },
  { name: "Solana", share: 14, value: "$11,801", color: "#92ddb8" },
  { name: "Other assets", share: 9, value: "$7,587", color: "#5e7165" },
];

export const ecosystemCategories = [
  { name: "Layer 1", detail: "Foundational networks", icon: "layers", color: "#a9e5b7" },
  { name: "Layer 2", detail: "Scaling the future", icon: "arrows", color: "#a7c8f3" },
  { name: "DeFi", detail: "Open financial tools", icon: "swap", color: "#e4c37a" },
  { name: "AI", detail: "Intelligence on-chain", icon: "sparkles", color: "#c4a7f2" },
  { name: "Gaming", detail: "Play, own, explore", icon: "gamepad", color: "#ec9fb0" },
  { name: "Infrastructure", detail: "The connective layer", icon: "network", color: "#8dd3cf" },
  { name: "Stablecoins", detail: "Digital dollar rails", icon: "coins", color: "#9ac6ef" },
  { name: "NFTs", detail: "Culture & collectibles", icon: "image", color: "#e3a8d5" },
];

export const insights = [
  {
    category: "Market outlook",
    headline: "What a changing rate environment could mean for digital assets",
    description:
      "A look at the macro signals investors are watching as policy expectations shift.",
    date: "Jul 08, 2025",
    readingTime: "6 min read",
  },
  {
    category: "On-chain",
    headline: "Stablecoin flows offer a new lens on market liquidity",
    description:
      "How settlement activity across major networks can help contextualize market moves.",
    date: "Jul 06, 2025",
    readingTime: "4 min read",
  },
  {
    category: "Technology",
    headline: "The next chapter in scaling open networks",
    description:
      "A guide to the upgrades and trade-offs shaping the multi-chain landscape.",
    date: "Jul 03, 2025",
    readingTime: "8 min read",
  },
];
