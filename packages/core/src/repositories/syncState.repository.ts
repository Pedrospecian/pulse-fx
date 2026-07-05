import { prisma } from "@pulse-fx/db";

export const syncStateRepository = {
  async get(indicatorCode: string) {
    return prisma.syncState.findUnique({ where: { indicatorCode } });
  },

  /* TTL check: retorna true se já se passaram `ttlMinutes` desde a última
   * sincronização bem-sucedida (ou se nunca sincronizou).
   */
  async isStale(indicatorCode: string, ttlMinutes: number): Promise<boolean> {
    const state = await prisma.syncState.findUnique({ where: { indicatorCode } });
    if (!state?.lastSyncedAt) return true;

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
      // lastSyncedAt fica de fora aqui de propósito: só uma sincronização
      // bem-sucedida deve "resetar o relógio" do TTL. Se falhar, o indicador
      // continua "stale" e o próximo ciclo do cron tenta de novo — sem essa
      // correção, um erro na primeira tentativa travava o indicador sem
      // dado por até SYNC_TTL_MINUTES, mesmo nunca tendo sincronizado nada.
      create: { indicatorCode, lastStatus: "error", lastError: error },
      update: { lastStatus: "error", lastError: error },
    });
  },
};
