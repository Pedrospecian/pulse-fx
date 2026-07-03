import type { RawPoint } from "./bcbClient";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10); // O FRED espera o formato YYYY-MM-DD
}

export async function fetchFredObservations(
  seriesId: string,
  apiKey: string,
  startDate: Date,
  endDate: Date
): Promise<RawPoint[]> {
  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${encodeURIComponent(seriesId)}` +
    `&api_key=${encodeURIComponent(apiKey)}` +
    `&file_type=json` +
    `&observation_start=${formatDate(startDate)}` +
    `&observation_end=${formatDate(endDate)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FRED (${seriesId}) respondeu ${res.status}`);
  }

  const body = (await res.json()) as { observations: Array<{ date: string; value: string }> };

  return body.observations
    .filter((o) => o.value !== ".") // O FRED usa o caractere "." para indicar observação ausente
    .map((o) => ({ date: new Date(o.date), value: Number(o.value) }));
}
