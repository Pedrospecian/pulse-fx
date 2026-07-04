import styled from "styled-components";
import { useFavorites } from "../hooks/useFavorites";
import { IndicatorCard } from "../components/IndicatorCard";
import { Spinner } from "../components/Spinner";
import { PageTitle, Text } from "../assets/components";

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export function Favorites() {
  const { favorites, toggleFavorite, loading } = useFavorites();

  if (loading) return <Spinner />;

  return (
    <div>
      <PageTitle>Meus Indicadores</PageTitle>

      {favorites.length === 0 ? (
        <Text>
          Você ainda não favoritou nenhum indicador. Clique na estrela de um indicador no
          Dashboard pra ele aparecer aqui.
        </Text>
      ) : (
        <CardsWrapper>
          {favorites.map((indicator) => (
            <IndicatorCard
              key={indicator.code}
              indicator={indicator}
              isFavorite
              onToggleFavorite={() => toggleFavorite(indicator)}
            />
          ))}
        </CardsWrapper>
      )}
    </div>
  );
}
