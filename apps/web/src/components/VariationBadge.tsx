interface VariationBadgeProps {
  variationPercent: number | null;
}

export function VariationBadge({ variationPercent }: VariationBadgeProps) {
  const isPositive = variationPercent >= 0;
  const formatted = `${isPositive ? "+" : ""}${variationPercent.toFixed(2)}%`;

  return (
    <span style={{ color: isPositive ? "green" : "red", fontWeight: 600 }}>
      {formatted}
    </span>
  );
}
