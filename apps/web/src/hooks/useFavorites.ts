import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type IndicatorSummary } from "../lib/api";

/**
 * Centraliza a lógica de favoritos pra não duplicar entre o Dashboard
 * (que só precisa saber QUAIS estão favoritados, pra pintar a estrela) e a
 * tela de "Meus indicadores" (que precisa da lista completa dos favoritos).
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<IndicatorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getFavorites()
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, []);

  // Memoizado: sem isso, um Set novo era criado a cada render e o
  // useCallback abaixo nunca reaproveitava a função (ficava recriando à toa).
  const favoriteCodes = useMemo(() => new Set(favorites.map((f) => f.code)), [favorites]);

  const toggleFavorite = useCallback(
    async (indicator: IndicatorSummary) => {
      const isFav = favoriteCodes.has(indicator.code);

      if (isFav) {
        await api.removeFavorite(indicator.code);
        setFavorites((prev) => prev.filter((f) => f.code !== indicator.code));
      } else {
        await api.addFavorite(indicator.code);
        setFavorites((prev) => [...prev, indicator]);
      }
    },
    [favoriteCodes]
  );

  return { favorites, favoriteCodes, toggleFavorite, loading };
}
