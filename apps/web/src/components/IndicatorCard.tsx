import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import type { IndicatorSummary } from "../lib/api";
import { VariationBadge } from "./VariationBadge";

interface Props {
  indicator: IndicatorSummary;
  isFavorite: boolean;
  onToggleFavorite: (code: string) => void;
}

type Variant = "positive" | "negative" | "neutral";

function getVariant(variationPercent: number | null): Variant {
  if (variationPercent === 0 || variationPercent === null) return "neutral";
  return variationPercent > 0 ? "positive" : "negative";
}

const surfaceByVariant = {
  positive: "positiveSurface",
  negative: "negativeSurface",
  neutral: "neutralSurface",
} as const;

const Card = styled.div<{ $variant: Variant }>`
  border-radius: 8px;
  min-width: 260px;
  box-sizing: border-box;
  background-color: ${({ theme, $variant }) => theme.colors[surfaceByVariant[$variant]]};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cardHeaderOverlay};
  border-radius: 8px 8px 0px 0px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const CardBody = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled(Link)`
  font-weight: 600;
  text-decoration: none;
  color: inherit;
`;

const FavoriteButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  margin-left: 6px;
`;

const Value = styled.p`
  font-size: 22px;
  margin: 8px 0 4px;
`;

const ReferenceDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 8px;
`;

export function IndicatorCard({ indicator, isFavorite, onToggleFavorite }: Props) {
  const variant = getVariant(indicator.variationPercent);

  return (
    <Card $variant={variant}>
      <CardHeader>
        <Title to={`/indicadores/${indicator.code}`}>{indicator.name}</Title>
        <FavoriteButton
          onClick={() => onToggleFavorite(indicator.code)}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
        </FavoriteButton>
      </CardHeader>

      <CardBody>
        <Value>
          {indicator.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) ?? "—"}{" "}
          <small>{indicator.unit}</small>
          <VariationBadge variationPercent={indicator.variationPercent} />
        </Value>

        <ReferenceDate>
          Ref.:{" "}
          {indicator.lastReferenceDate
            ? new Date(indicator.lastReferenceDate).toLocaleDateString("pt-BR")
            : "—"}
        </ReferenceDate>
      </CardBody>
    </Card>
  );
}
