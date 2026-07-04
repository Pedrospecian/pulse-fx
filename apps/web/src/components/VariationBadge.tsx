import styled, { css } from "styled-components";

interface VariationBadgeProps {
  variationPercent: number | null;
}

const Badge = styled.span<{ $isPositive: boolean | null }>`
  font-weight: 600;

  ${({ $isPositive }) =>
    $isPositive === null
      ? css`
          color: #444444;
          font-weight: 400;
        `
      : css`
          color: ${$isPositive ? "green" : "red"};
        `}
`;

export function VariationBadge({ variationPercent }: VariationBadgeProps) {
  if (variationPercent === null) {
    return (
      <Badge data-testid="variation-badge" $isPositive={null}>
        — sem dado suficiente
      </Badge>
    );
  }

  const isPositive = variationPercent >= 0;
  const formatted = `${isPositive ? "+" : ""}${variationPercent.toFixed(2)}%`;

  return (
    <Badge data-testid="variation-badge" $isPositive={isPositive}>
      {formatted}
    </Badge>
  );
}
