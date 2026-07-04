import styled from "styled-components";
import { useEffect, useState } from "react";
import { api, type IndicatorSummary } from "../lib/api";
import { IndicatorCard } from "../components/IndicatorCard";
import { Text, PageTitle } from "../assets/components";

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export function Dashboard() {
  const [indicators, setIndicators] = useState<IndicatorSummary[]>([]);
  const [favoriteCodes, setFavoriteCodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getFavorites()])
      .then(([dashboard, favorites]) => {
        setIndicators(dashboard);
        setFavoriteCodes(new Set(favorites.map((f) => f.code)));
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleFavorite(code: string) {
    const isFav = favoriteCodes.has(code);
    if (isFav) {
      await api.removeFavorite(code);
      setFavoriteCodes((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    } else {
      await api.addFavorite(code);
      setFavoriteCodes((prev) => new Set(prev).add(code));
    }
  }

  if (loading) return <p>Carregando indicadores...</p>;

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
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </CardsWrapper>
    </div>
  );
}
