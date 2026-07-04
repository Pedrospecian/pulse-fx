import { prisma } from "@pulse-fx/db";

export const syncStateRepository = {
  async get(indicatorCode: string) {
    return prisma.syncState.findUnique({ where: { indicatorCode } });
  },

  async isStale(indicatorCode: string, ttlMinutes: number): Promise<boolean> {
    const state = await prisma.syncState.findUnique({ where: { indicatorCode } });
    if (!state?.lastSyncedAt) {
      return true;
    }

    const elapsedMs = Date.now() - state.lastSyncedAt.getTime();
    return elapsedMs >= ttlMinutes * 60_000;
  },

  async markSuccess(indicatorCode: string): Promise<void> {
    await prisma.syncState.upsert({
      where: { indicatorCode },
      create: { indicatorCode, lastSyncedAt: new Date(), lastStatus: "success", lastError: null },
      update: { lastSyncedAt: new Date(), lastStatus: "success", lastError: null },
    });
  },

  async markError(indicatorCode: string, error: string): Promise<void> {
    await prisma.syncState.upsert({
      where: { indicatorCode },
      create: { indicatorCode, lastSyncedAt: new Date(), lastStatus: "error", lastError: error },
      update: { lastStatus: "error", lastError: error },
    });
  },
};
