import styled from "styled-components";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface VariationBadgeProps {
  variationPercent: number | null;
}

type Variant = "positive" | "negative" | "neutral";

function getVariant(variationPercent: number | null): Variant {
  if (variationPercent === 0 || variationPercent === null) return "neutral";
  return variationPercent > 0 ? "positive" : "negative";
}

const Badge = styled.span<{ $variant: Variant }>`
  font-weight: 600;
  font-size: 75%;
  color: ${({ theme }) => theme.colors.onBadge};
  border-radius: 6px;
  box-sizing: border-box;
  margin-left: 12px;
  padding: 3px 6px;
  background-color: ${({ theme, $variant }) => theme.colors[$variant]};
`;

function getCaret(variationPercent: number | null) {
  if (variationPercent === 0 || variationPercent === null) {
    return '';
  }

  if (variationPercent > 0) {
    return <FaCaretUp />;
  }

  return <FaCaretDown />;
}

export function VariationBadge({ variationPercent }: VariationBadgeProps) {
  const variant = getVariant(variationPercent);

  if (variationPercent === null) {
    return (
      <Badge data-testid="variation-badge" $variant={variant}>
        — sem dado suficiente
      </Badge>
    );
  }

  const isPositive = variationPercent > 0;
  const formatted = `${(isPositive) ? "+" : ""}${variationPercent.toFixed(2)}%`;

  return (
    <Badge data-testid="variation-badge" $variant={variant}>
      {getCaret(variationPercent)}
      {formatted}
    </Badge>
  );
}
