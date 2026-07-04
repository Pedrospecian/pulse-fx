import styled, { css } from "styled-components";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface VariationBadgeProps {
  variationPercent: number | null;
}

const Badge = styled.span<{ $isPositive: boolean | null }>`
  font-weight: 600;
  font-size: 75%;
  color: #ffffff;
  border-radius: 6px;
  margin-left: 12px;
  padding: 3px 6px;

  ${({ $isPositive }) =>
    $isPositive === null
      ? css`
          color: #999999;
          font-weight: 400;
        `
      : css`
          background-color: ${$isPositive ? "#55b542" : "#ff6552"};
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
      {isPositive ? <FaCaretUp /> : <FaCaretDown />}
      {formatted}
    </Badge>
  );
}
