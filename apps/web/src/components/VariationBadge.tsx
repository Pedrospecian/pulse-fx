interface VariationBadgeProps {
  variationPercent: number | null;
}

export function VariationBadge({ variationPercent }: VariationBadgeProps) {
  if (variationPercent === null) {
    return <span data-testid="variation-badge">— sem dado suficiente</span>;
  }

  const isPositive = variationPercent >= 0;
  const formatted = `${isPositive ? "+" : ""}${variationPercent.toFixed(2)}%`;

  return (
    <span
      data-testid="variation-badge"
      style={{ color: isPositive ? "green" : "red", fontWeight: 600 }}
    >
      {formatted}
    </span>
  );
}
