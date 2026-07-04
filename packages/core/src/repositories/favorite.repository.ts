import { prisma } from "@pulse-fx/db";

export const favoriteRepository = {
  async list(): Promise<string[]> {
    const rows = await prisma.favorite.findMany({ select: { indicatorCode: true } });
    return rows.map((r) => r.indicatorCode);
  },

  async add(indicatorCode: string): Promise<void> {
    await prisma.favorite.upsert({
      where: { indicatorCode },
      create: { indicatorCode },
      update: {},
    });
  },

  async remove(indicatorCode: string): Promise<void> {
    await prisma.favorite.deleteMany({ where: { indicatorCode } });
  },
};
