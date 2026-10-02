type MiniChartProps = {
  values: number[];
  color: string;
  className?: string;
};

export function MiniChart({ values, color, className }: MiniChartProps) {
  const width = 112;
  const height = 38;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 3 - ((value - min) / spread) * (height - 7);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${values[values.length - 1] >= values[0] ? "Upward" : "Downward"} price trend`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
