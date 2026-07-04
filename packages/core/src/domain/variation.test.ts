import { describe, expect, it } from "vitest";
import {
  calculateVariation,
  calculateVariationForSeriesType,
  type ObservationPoint,
} from "./variation";

function point(dateStr: string, value: number): ObservationPoint {
  return { referenceDate: new Date(dateStr), value };
}

describe("calculateVariation", () => {
  it("calcula variação positiva corretamente (série diária, N=1)", () => {
    const observationsDesc: ObservationPoint[] = [
      point("2026-07-02", 5.5),
      point("2026-07-01", 5.0),
    ];

    const result = calculateVariation(observationsDesc, 1);

    expect(result).not.toBeNull();
    expect(result!.currentValue).toBe(5.5);
    expect(result!.previousValue).toBe(5.0);
    expect(result!.variationPercent).toBeCloseTo(10, 5);
  });

  it("calcula variação negativa corretamente", () => {
    const observationsDesc: ObservationPoint[] = [point("2026-07-02", 4.5), point("2026-07-01", 5.0)];

    const result = calculateVariation(observationsDesc, 1);

    expect(result!.variationPercent).toBeCloseTo(-10, 5);
  });

  it("retorna null quando não há histórico suficiente para o N pedido", () => {
    const observationsDesc: ObservationPoint[] = [point("2026-07-02", 5.5)];

    const result = calculateVariation(observationsDesc, 1);

    expect(result).toBeNull();
  });

  it("retorna null quando o valor de comparação é zero (evita divisão por zero)", () => {
    const observationsDesc: ObservationPoint[] = [point("2026-07-02", 5.5), point("2026-07-01", 0)];

    const result = calculateVariation(observationsDesc, 1);

    expect(result).toBeNull();
  });

  it("lança erro se N for menor ou igual a zero", () => {
    const observationsDesc: ObservationPoint[] = [point("2026-07-02", 5.5), point("2026-07-01", 5.0)];

    expect(() => calculateVariation(observationsDesc, 0)).toThrow();
  });

  it("usa a janela padrão correta por tipo de série (DAILY vs MONTHLY)", () => {
    const observationsDesc: ObservationPoint[] = [
      point("2026-07-02", 110),
      point("2026-06-02", 100),
    ];

    const monthly = calculateVariationForSeriesType(observationsDesc, "MONTHLY");
    expect(monthly!.variationPercent).toBeCloseTo(10, 5);

    const daily = calculateVariationForSeriesType(observationsDesc, "DAILY");
    expect(daily!.variationPercent).toBeCloseTo(10, 5); // mesma janela (N=1), mas datas diferentes
  });
});
