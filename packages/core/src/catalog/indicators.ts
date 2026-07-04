export type IndicatorSource = "BCB" | "FRED";
export type IndicatorSeriesType = "DAILY" | "MONTHLY";

export interface IndicatorDefinition {
  code: string;
  name: string;
  description: string;
  source: IndicatorSource;
  // Código da série na fonte de origem (SGS/PTAX no BCB, series_id no FRED).
  sourceSeriesId: string;
  seriesType: IndicatorSeriesType;
  unit: string;
}

export const INDICATORS_CATALOG: IndicatorDefinition[] = [
  {
    code: "USD_BRL_PTAX",
    name: "Dólar comercial (PTAX)",
    description: "Taxa de câmbio de fechamento USD/BRL divulgada pelo Banco Central (boletim PTAX).",
    source: "BCB",
    sourceSeriesId: "PTAX",
    seriesType: "DAILY",
    unit: "BRL",
  },
  {
    code: "SELIC_META",
    name: "Taxa Selic (meta)",
    description: "Meta da taxa Selic definida pelo Copom, referência de juros básicos da economia brasileira.",
    source: "BCB",
    sourceSeriesId: "432",
    seriesType: "DAILY",
    unit: "% a.a.",
  },
  {
    code: "US_FED_FUNDS_RATE",
    name: "Fed Funds Rate (EUA)",
    description: "Taxa efetiva de juros dos EUA (Federal Funds Effective Rate), referência global de custo de capital em dólar.",
    source: "FRED",
    sourceSeriesId: "DFF",
    seriesType: "DAILY",
    unit: "% a.a.",
  },
  {
    code: "US_CPI",
    name: "CPI (EUA)",
    description: "Índice de preços ao consumidor dos EUA (CPI-U), termômetro de inflação que influencia decisões do Fed.",
    source: "FRED",
    sourceSeriesId: "CPIAUCSL",
    seriesType: "MONTHLY",
    unit: "index",
  },
];

export function getIndicatorDefinition(code: string): IndicatorDefinition | undefined {
  return INDICATORS_CATALOG.find((i) => i.code === code);
}
