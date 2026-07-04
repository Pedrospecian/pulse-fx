import styled from "styled-components";
import { useEffect, useState } from "react";
import { api, type IndicatorSummary } from "../lib/api";
import { IndicatorCard } from "../components/IndicatorCard";
import { Spinner } from "../components/Spinner";
import { Text, PageTitle } from "../assets/components";
import { useFavorites } from "../hooks/useFavorites";

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export function Dashboard() {
  const [indicators, setIndicators] = useState<IndicatorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoriteCodes, toggleFavorite } = useFavorites();

  useEffect(() => {
    api
      .getDashboard()
      .then(setIndicators)
      .finally(() => setLoading(false));
  }, []);

  function handleToggleFavorite(code: string) {
    const indicator = indicators.find((i) => i.code === code);
    if (indicator) toggleFavorite(indicator);
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <PageTitle>Página Inicial</PageTitle>
      <Text>
        Este conteúdo não é recomendação de investimento, mas sim educacional.
      </Text>

      <CardsWrapper>
        {indicators.map((indicator) => (
          <IndicatorCard
            key={indicator.code}
            indicator={indicator}
            isFavorite={favoriteCodes.has(indicator.code)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </CardsWrapper>
    </div>
  );
}
