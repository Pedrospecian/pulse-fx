import { prisma } from "@pulse-fx/db";
import type { ObservationPoint } from "../domain/variation";

export const observationRepository = {
  async findLatest(indicatorCode: string, limit: number): Promise<ObservationPoint[]> {
    const rows = await prisma.observation.findMany({
      where: { indicatorCode },
      orderBy: { referenceDate: "desc" },
      take: limit,
    });

    return rows.map((r) => ({ referenceDate: r.referenceDate, value: Number(r.value) }));
  },

  async findHistory(indicatorCode: string, sinceDaysAgo: number): Promise<ObservationPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - sinceDaysAgo);

    const rows = await prisma.observation.findMany({
      where: { indicatorCode, referenceDate: { gte: since } },
      orderBy: { referenceDate: "asc" },
    });

    return rows.map((r) => ({ referenceDate: r.referenceDate, value: Number(r.value) }));
  },

  // Upsert idempotente (evita duplicar observação do mesmo dia).
  async upsertMany(
    indicatorCode: string,
    points: Array<{ referenceDate: Date; value: number }>
  ): Promise<number> {
    let count = 0;
    for (const p of points) {
      await prisma.observation.upsert({
        where: {
          indicatorCode_referenceDate: {
            indicatorCode,
            referenceDate: p.referenceDate,
          },
        },
        create: { indicatorCode, referenceDate: p.referenceDate, value: p.value },
        update: { value: p.value },
      });
      count++;
    }
    return count;
  },
}; 
