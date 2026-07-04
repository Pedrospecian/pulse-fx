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
  border-radius: 8px;
  min-width: 220px;
  background-color: #1d1d1d88;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #15151588;
  border-radius: 8px 8px 0px 0px;
  padding: 16px;
`;

const CardBody = styled.div`
  padding: 16px;
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
  color: #ffbb00;
  display: flex;
  align-items: center;
`;

const Value = styled.p`
  font-size: 22px;
  margin: 8px 0 4px;
`;

const ReferenceDate = styled.p`
  font-size: 12px;
  color: #999999;
  margin-top: 8px;
`;

export function IndicatorCard({ indicator, isFavorite, onToggleFavorite }: Props) {
  return (
    <Card>
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
        </Value>

        <VariationBadge variationPercent={indicator.variationPercent} />

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
