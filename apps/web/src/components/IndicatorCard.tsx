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

const Card = styled.div`
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 16px;
  min-width: 220px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  color: #eab308;
  display: flex;
  align-items: center;
`;

const Value = styled.p`
  font-size: 22px;
  margin: 8px 0 4px;
`;

const ReferenceDate = styled.p`
  font-size: 12px;
  color: #444444;
  margin-top: 8px;
`;

export function IndicatorCard({ indicator, isFavorite, onToggleFavorite }: Props) {
  return (
    <Card>
      <Header>
        <Title to={`/indicadores/${indicator.code}`}>{indicator.name}</Title>
        <FavoriteButton
          onClick={() => onToggleFavorite(indicator.code)}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </FavoriteButton>
      </Header>

      <Value>
        {indicator.lastValue?.toLocaleString("pt-BR", { maximumFractionDigits: 4 }) ?? "—"}{" "}
        <small>{indicator.unit}</small>
      </Value>

      <VariationBadge variationPercent={indicator.variationPercent} />

      <ReferenceDate>
        Ref.:{" "}
        {indicator.lastReferenceDate
          ? new Date(indicator.lastReferenceDate).toLocaleDateString("pt-BR")
          : "—"}
      </ReferenceDate>
    </Card>
  );
}
