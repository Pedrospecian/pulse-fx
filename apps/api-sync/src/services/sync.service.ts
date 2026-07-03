import {
  INDICATORS_CATALOG,
  observationRepository,
  syncStateRepository,
  type IndicatorDefinition,
} from "@pulse-fx/core";
import { fetchPtax, fetchSgsSeries } from "../integrations/bcbClient";
import { fetchFredObservations } from "../integrations/fredClient";
import { publishIndicatorUpdated } from "../messaging/publisher";

const FRED_API_KEY = process.env.FRED_API_KEY || "";

// Janela de busca no histórico: diária cobre ~1 ano, mensal cobre ~5 anos
function getLookbackWindow(indicator: IndicatorDefinition): Date {
  const start = new Date();
  const daysBack = indicator.seriesType === "DAILY" ? 400 : 1900;
  start.setDate(start.getDate() - daysBack);
  return start;
}

async function fetchFromSource(indicator: IndicatorDefinition, start: Date, end: Date) {
  switch (indicator.source) {
    case "BCB":
      if (indicator.code === "USD_BRL_PTAX") {
        return fetchPtax(start, end);
      }
      return fetchSgsSeries(indicator.sourceSeriesId, start, end);
    case "FRED":
      if (!FRED_API_KEY) {
        throw new Error("FRED_API_KEY não configurada");
      }
      return fetchFredObservations(indicator.sourceSeriesId, FRED_API_KEY, start, end);
    default:
      throw new Error(`Fonte desconhecida: ${indicator.source}`);
  }
}

/*
 * Sincroniza um indicador se o TTL tiver expirado (ou se `force` for true).
 * Retorna um resumo do resultado, usado tanto pelo cron quanto pela rota admin.
 */
export async function syncIndicator(indicator: IndicatorDefinition, options: { force?: boolean; ttlMinutes: number }) {
  const stale = options.force || (await syncStateRepository.isStale(indicator.code, options.ttlMinutes));

  if (!stale) {
    return { code: indicator.code, skipped: true as const };
  }

  try {
    const end = new Date();
    const start = getLookbackWindow(indicator);

    const rawPoints = await fetchFromSource(indicator, start, end);
    const count = await observationRepository.upsertMany(
      indicator.code,
      rawPoints.map((p) => ({ referenceDate: p.date, value: p.value }))
    );

    await syncStateRepository.markSuccess(indicator.code);

    const latest = rawPoints.at(-1);
    if (latest) {
      await publishIndicatorUpdated(indicator.code, latest.date);
    }

    return { code: indicator.code, skipped: false as const, observationsWritten: count };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await syncStateRepository.markError(indicator.code, message);
    return { code: indicator.code, skipped: false as const, error: message };
  }
}

export async function syncAll(options: { force?: boolean; ttlMinutes: number }) {
  const results = [];
  for (const indicator of INDICATORS_CATALOG) {
    results.push(await syncIndicator(indicator, options));
  }
  return results;
}
