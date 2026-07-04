export type SeriesTypeLike = "DAILY" | "MONTHLY";

export interface ObservationPoint {
  referenceDate: Date;
  value: number;
}

export interface VariationResult {
  currentValue: number;
  currentDate: Date;
  previousValue: number;
  previousDate: Date;
  variationPercent: number;
}

export const DEFAULT_COMPARISON_WINDOW: Record<SeriesTypeLike, number> = {DAILY: 1, MONTHLY: 1};

export function calculateVariation(
  observationsDesc: ObservationPoint[],
  n: number
): VariationResult | null {
  if (n <= 0) {
    throw new Error("n deve ser maior que zero");
  }

  if (observationsDesc.length <= n) {
    return null;
  }

  const current = observationsDesc[0];
  const previous = observationsDesc[n];

  if (previous.value === 0) {
    return null;
  }

  const variationPercent = ((current.value - previous.value) / Math.abs(previous.value)) * 100;

  return {
    currentValue: current.value,
    currentDate: current.referenceDate,
    previousValue: previous.value,
    previousDate: previous.referenceDate,
    variationPercent,
  };
}

export function calculateVariationForSeriesType(
  observationsDesc: ObservationPoint[],
  seriesType: SeriesTypeLike
): VariationResult | null {
  const n = DEFAULT_COMPARISON_WINDOW[seriesType];
  return calculateVariation(observationsDesc, n);
}
