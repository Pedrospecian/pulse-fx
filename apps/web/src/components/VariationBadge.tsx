import styled, { css } from "styled-components";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface VariationBadgeProps {
  variationPercent: number | null;
}

const Badge = styled.span<{ $bgColor: string | null }>`
  font-weight: 600;
  font-size: 75%;
  color: #ffffff;
  border-radius: 6px;
  box-sizing: border-box;
  margin-left: 12px;
  padding: 3px 6px;
  background-color: ${({ $bgColor }) => $bgColor};
`;

function getBadgeBackgroundColor(variationPercent: number | null) {
  if (variationPercent === 0 || variationPercent === null) {
    return '#5d5d5d';
  }

  return variationPercent > 0 ? "#55b542" : "#ff6552";
}

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
  if (variationPercent === null) {
    return (
      <Badge data-testid="variation-badge" $bgColor={getBadgeBackgroundColor(null)}>
        — sem dado suficiente
      </Badge>
    );
  }

  const isPositive = variationPercent >= 0;
  const isNeutral = variationPercent === 0;
  const formatted = `${(isPositive && !isNeutral) ? "+" : ""}${variationPercent.toFixed(2)}%`;

  return (
    <Badge data-testid="variation-badge" $bgColor={getBadgeBackgroundColor(variationPercent)}>
      {getCaret(variationPercent)}
      {formatted}
    </Badge>
  );
}
