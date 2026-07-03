import type { RawPoint } from "./bcbClient";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
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
  
  const body = (await res.json()) as { observations: Array<{ date: string; value: string }> };

  return body.observations
    .filter((o) => o.value !== ".")
    .map((o) => ({ date: new Date(o.date), value: Number(o.value) }));
}
