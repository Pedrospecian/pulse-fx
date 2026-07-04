export type IndicatorSource = "BCB" | "FRED";
export type IndicatorSeriesType = "DAILY" | "MONTHLY";

export interface IndicatorDefinition {
  code: string;
  name: string;
  description: string;
  source: IndicatorSource;
  sourceSeriesId: string;
  seriesType: IndicatorSeriesType;
  unit: string;
}

export const INDICATORS_CATALOG: IndicatorDefinition[] = [
  {
    code: "USD_BRL_PTAX",
    name: "Dólar comercial (PTAX)",
    description: "",
    source: "BCB",
    sourceSeriesId: "PTAX",
    seriesType: "DAILY",
    unit: "BRL",
  },
  {
    code: "SELIC_META",
    name: "Taxa Selic (meta)",
    description: "",
    source: "BCB",
    sourceSeriesId: "432",
    seriesType: "DAILY",
    unit: "% a.a.",
  },
  {
    code: "US_FED_FUNDS_RATE",
    name: "Fed Funds Rate (EUA)",
    description: "",
    source: "FRED",
    sourceSeriesId: "DFF",
    seriesType: "DAILY",
    unit: "% a.a.",
  },
  {
    code: "US_CPI",
    name: "CPI (EUA)",
    description: "",
    source: "FRED",
    sourceSeriesId: "CPIAUCSL",
    seriesType: "MONTHLY",
    unit: "index",
  },
];

export function getIndicatorDefinition(code: string): IndicatorDefinition | undefined {
  return INDICATORS_CATALOG.find((i) => i.code === code);
}
