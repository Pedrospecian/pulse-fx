import { describe, expect, it, vi, beforeEach } from "vitest";

const upsertMock = vi.fn();
const findManyMock = vi.fn();

vi.mock("@pulse-fx/db", () => ({
  prisma: {
    observation: {
      upsert: (...args: unknown[]) => upsertMock(...args),
      findMany: (...args: unknown[]) => findManyMock(...args),
    },
  },
}));

describe("observationRepository", () => {
  beforeEach(() => {
    upsertMock.mockReset();
    findManyMock.mockReset();
  });

  it("faz upsert de cada ponto usando a chave composta (indicatorCode, referenceDate)", async () => {
    const { observationRepository } = await import("./observation.repository");

    const points = [
      { referenceDate: new Date("2026-07-01"), value: 5.0 },
      { referenceDate: new Date("2026-07-02"), value: 5.5 },
    ];

    const count = await observationRepository.upsertMany("USD_BRL_PTAX", points);

    expect(count).toBe(2);
    expect(upsertMock).toHaveBeenCalledTimes(2);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          indicatorCode_referenceDate: {
            indicatorCode: "USD_BRL_PTAX",
            referenceDate: points[1].referenceDate,
          },
        },
      })
    );
  });

  it("converte o Decimal do Prisma para number ao buscar as últimas observações", async () => {
    findManyMock.mockResolvedValueOnce([
      { referenceDate: new Date("2026-07-02"), value: { toString: () => "5.5" } },
    ]);

    const { observationRepository } = await import("./observation.repository");
    const result = await observationRepository.findLatest("USD_BRL_PTAX", 1);

    expect(result[0].value).toBe(5.5);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { indicatorCode: "USD_BRL_PTAX" }, take: 1 })
    );
  });
});
