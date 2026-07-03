import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

const mockIndicator = {
  code: "USD_BRL_PTAX",
  name: "Dólar comercial (PTAX)",
  description: "desc",
  source: "BCB",
  seriesType: "DAILY" as const,
  unit: "BRL",
};

vi.mock("@pulse-fx/core", () => ({
  indicatorRepository: {
    findAll: vi.fn().mockResolvedValue([mockIndicator]),
    findByCode: vi.fn().mockResolvedValue(mockIndicator),
  },
  observationRepository: {
    findHistory: vi.fn().mockResolvedValue([
      { referenceDate: new Date("2026-07-01"), value: 5.0 },
      { referenceDate: new Date("2026-07-02"), value: 5.5 },
    ]),
  },
  favoriteRepository: {
    list: vi.fn().mockResolvedValue([]),
    add: vi.fn(),
    remove: vi.fn(),
  },
  calculateVariationForSeriesType: vi.fn().mockReturnValue({
    currentValue: 5.5,
    currentDate: new Date("2026-07-02"),
    previousValue: 5.0,
    previousDate: new Date("2026-07-01"),
    variationPercent: 10,
  }),
}));

describe("indicatorsRouter", () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.resetModules();
    const { indicatorsRouter } = await import("../routes/indicators.routes");
    app = express();
    app.use(express.json());
    app.use("/api", indicatorsRouter);
  });

  it("GET /api/indicators retorna o dashboard com variação calculada", async () => {
    const res = await request(app).get("/api/indicators");
    expect(res.status).toBe(200);
    expect(res.body[0].code).toBe("USD_BRL_PTAX");
    expect(res.body[0].variationPercent).toBe(10);
  });

  it("GET /api/indicators/:code retorna 404 para indicador inexistente", async () => {
    const core = await import("@pulse-fx/core");
    vi.mocked(core.indicatorRepository.findByCode).mockResolvedValueOnce(null as any);

    const res = await request(app).get("/api/indicators/DOES_NOT_EXIST");
    expect(res.status).toBe(404);
  });

  it("GET /api/indicators/:code retorna o histórico e a data de referência correta", async () => {
    const res = await request(app).get("/api/indicators/USD_BRL_PTAX");
    expect(res.status).toBe(200);
    expect(res.body.history).toHaveLength(2);
    expect(res.body.lastValue).toBe(5.5);
  });
});
