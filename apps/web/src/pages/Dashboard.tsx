import { useEffect, useState } from "react";
import { api, type IndicatorSummary } from "../lib/api";
import { IndicatorCard } from "../components/IndicatorCard";

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
      <h1>Pulse FX</h1>
      <p style={{ color: "#57606a", fontSize: 13 }}>
        Este conteúdo não é recomendação de investimento, mas sim educacional.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        {indicators.map((indicator) => (
          <IndicatorCard
            key={indicator.code}
            indicator={indicator}
            isFavorite={favoriteCodes.has(indicator.code)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
