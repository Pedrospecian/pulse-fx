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

/**
 * Janela padrão de comparação (N), por tipo de série.
 *
 * DAILY (ex.: câmbio/PTAX): compara o último fechamento com o fechamento ANTERIOR disponível (N=1).
 * MONTHLY (ex.: indicadores macro): compara o último mês com o mês imediatamente anterior (N=1),
 * variação mês a mês (MoM).
 */
export const DEFAULT_COMPARISON_WINDOW: Record<SeriesTypeLike, number> = {
  DAILY: 1,
  MONTHLY: 1,
};

/**
 * Calcula a variação percentual entre a observação mais recente e a
 * observação N posições antes dela, dentro do histórico já persistido.
 *
 * @param observationsDesc: observações ordenadas da mais recente para a mais antiga.
 * @param n: quantas observações "voltar" para achar o valor de comparação.
 */
export function calculateVariation(
  observationsDesc: ObservationPoint[],
  n: number
): VariationResult | null {
  if (n <= 0) {
    throw new Error("O valor de n deve ser maior que zero");
  }

  if (observationsDesc.length <= n) {
    // Não há histórico suficiente para calcular a variação com segurança.
    return null;
  }

  const current = observationsDesc[0];
  const previous = observationsDesc[n];

  if (previous.value === 0) {
    // Evita divisão por zero
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

// Atalho que já aplica a janela padrão definida para o tipo de série
export function calculateVariationForSeriesType(
  observationsDesc: ObservationPoint[],
  seriesType: SeriesTypeLike
): VariationResult | null {
  const n = DEFAULT_COMPARISON_WINDOW[seriesType];
  return calculateVariation(observationsDesc, n);
}
