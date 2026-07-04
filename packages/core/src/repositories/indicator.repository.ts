import { prisma, type Indicator } from "@pulse-fx/db";
import { INDICATORS_CATALOG } from "../catalog/indicators";

export const indicatorRepository = {
  async findAll(): Promise<Indicator[]> {
    return prisma.indicator.findMany({ orderBy: { code: "asc" } });
  },

  async findByCode(code: string): Promise<Indicator | null> {
    return prisma.indicator.findUnique({ where: { code } });
  },

  async seedCatalog(): Promise<void> {
    for (const def of INDICATORS_CATALOG) {
      await prisma.indicator.upsert({
        where: { code: def.code },
        create: {
          code: def.code,
          name: def.name,
          description: def.description,
          source: def.source,
          sourceSeriesId: def.sourceSeriesId,
          seriesType: def.seriesType,
          unit: def.unit,
        },
        update: {
          name: def.name,
          description: def.description,
          sourceSeriesId: def.sourceSeriesId,
          seriesType: def.seriesType,
          unit: def.unit,
        },
      });
    }
  },
};
