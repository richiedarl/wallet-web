type AssetIconProps = {
  symbol: string;
  color: string;
  small?: boolean;
};

const icons: Record<string, string> = {
  BTC: "₿",
  ETH: "◆",
  SOL: "≋",
  BNB: "✦",
  XRP: "✕",
  ADA: "●",
};

export function AssetIcon({ symbol, color, small = false }: AssetIconProps) {
  return (
    <span
      className={`asset-icon${small ? " small" : ""}`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {icons[symbol] ?? symbol.slice(0, 1)}
    </span>
  );
}
