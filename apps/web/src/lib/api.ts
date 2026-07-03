const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface IndicatorSummary {
  code: string;
  name: string;
  description: string;
  source: "BCB" | "FRED";
  seriesType: "DAILY" | "MONTHLY";
  unit: string;
  lastValue: number | null;
  lastReferenceDate: string | null;
  variationPercent: number | null;
}

export interface IndicatorDetail extends IndicatorSummary {
  history: Array<{ referenceDate: string; value: number }>;
  limitations: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status} ao buscar ${path}`);
  return res.json();
}

export const api = {
  getDashboard: () => get<IndicatorSummary[]>("/api/indicators"),
  getIndicatorDetail: (code: string) => get<IndicatorDetail>(`/api/indicators/${code}`),
  getFavorites: () => get<IndicatorSummary[]>("/api/favorites"),
  addFavorite: (code: string) =>
    fetch(`${API_URL}/api/indicators/${code}/favorite`, { method: "POST" }),
  removeFavorite: (code: string) =>
    fetch(`${API_URL}/api/indicators/${code}/favorite`, { method: "DELETE" }),
};
