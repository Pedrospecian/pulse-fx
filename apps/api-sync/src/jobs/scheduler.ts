import cron from "node-cron";
import { syncAll } from "../services/sync.service";

const TTL_MINUTES = Number(process.env.SYNC_TTL_MINUTES) || 60;

export function startScheduler() {
  cron.schedule("*/15 * * * *", async () => {
    console.log("[scheduler] verificando indicadores para sincronização...");
    const results = await syncAll({ ttlMinutes: TTL_MINUTES });
    const synced = results.filter((r) => !r.skipped);
    console.log(`[scheduler] ${synced.length} indicador(es) sincronizado(s), ${results.length - synced.length} pulado(s) (TTL válido).`);
  });

  console.log(`[scheduler] iniciado: TTL de ${TTL_MINUTES} min por indicador.`);
}
