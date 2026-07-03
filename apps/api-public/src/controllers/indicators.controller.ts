import type { Request, Response } from "express";
import {
  indicatorRepository,
  observationRepository,
  favoriteRepository,
  calculateVariationForSeriesType,
} from "@pulse-fx/core";

// Janela de histórico exibida na tela de detalhe, por tipo de série.
const HISTORY_WINDOW_DAYS = { DAILY: 90, MONTHLY: 730 } as const;

async function buildIndicatorSummary(indicator: Awaited<ReturnType<typeof indicatorRepository.findByCode>>) {
  if (!indicator) return null;

  const windowDays = HISTORY_WINDOW_DAYS[indicator.seriesType];
  const historyAsc = await observationRepository.findHistory(indicator.code, windowDays);
  const historyDesc = [...historyAsc].reverse();

  const variation = calculateVariationForSeriesType(historyDesc, indicator.seriesType);

  return {
    code: indicator.code,
    name: indicator.name,
    description: indicator.description,
    source: indicator.source,
    seriesType: indicator.seriesType,
    unit: indicator.unit,
    lastValue: variation?.currentValue ?? historyDesc[0]?.value ?? null,
    lastReferenceDate: variation?.currentDate ?? historyDesc[0]?.referenceDate ?? null,
    variationPercent: variation?.variationPercent ?? null,
  };
}

export async function getDashboard(_req: Request, res: Response) {
  const indicators = await indicatorRepository.findAll();
  const summaries = await Promise.all(indicators.map(buildIndicatorSummary));

  res.json(summaries);
}

export async function getIndicatorDetail(req: Request, res: Response) {
  const { code } = req.params;

  const indicator = await indicatorRepository.findByCode(code);
  if (!indicator) {
    return res.status(404).json({ error: "Indicador não encontrado" });
  }

  const windowDays = HISTORY_WINDOW_DAYS[indicator.seriesType];
  const history = await observationRepository.findHistory(code, windowDays);
  const summary = await buildIndicatorSummary(indicator);

  const payload = {
    ...summary,
    history: history.map((h) => ({ referenceDate: h.referenceDate, value: h.value })),
    limitations:
      "Dados públicos sujeitos a revisão pela fonte original (BCB/FRED). " +
      "Dias sem publicação (fins de semana/feriados) não geram observação. " +
      "Utilizamos o último dado válido conhecido, sem interpolação.",
  };

  res.json(payload);
}

export async function listFavorites(_req: Request, res: Response) {
  const codes = await favoriteRepository.list();
  const indicators = await Promise.all(codes.map((c) => indicatorRepository.findByCode(c)));
  const summaries = await Promise.all(indicators.filter(Boolean).map(buildIndicatorSummary));
  res.json(summaries);
}

export async function addFavorite(req: Request, res: Response) {
  const { code } = req.params;
  const indicator = await indicatorRepository.findByCode(code);
  if (!indicator) {
    return res.status(404).json({ error: "Indicador não encontrado" });
  }
  await favoriteRepository.add(code);
  res.status(204).send();
}

export async function removeFavorite(req: Request, res: Response) {
  const { code } = req.params;
  await favoriteRepository.remove(code);
  res.status(204).send();
}
