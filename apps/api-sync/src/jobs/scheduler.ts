import cron from "node-cron";
import { syncAll } from "../services/sync.service";

const TTL_MINUTES = Number(process.env.SYNC_TTL_MINUTES) || 60;

async function runSyncCycle() {
  console.log("[scheduler] verificando indicadores para sincronização...");
  const results = await syncAll({ ttlMinutes: TTL_MINUTES });

  for (const r of results) {
    if (r.skipped) {
      console.log(`[scheduler] ${r.code}: pulado (TTL válido)`);
    } else if ("error" in r && r.error) {
      console.error(`[scheduler] ${r.code}: FALHOU — ${r.error}`);
    } else {
      console.log(`[scheduler] ${r.code}: sincronizado`);
    }
  }
}

// Roda a cada 15 minutos, mas cada indicador só é realmente buscado na fonte
// externa caso o TTL (SYNC_TTL_MINUTES) já tiver expirado. Isso impede que o
// sistema faça chamadas descontroladas/redundantes às APIs do BCB e do FRED.
//
// Além do cron periódico, disparo uma sincronização já no boot: sem isso, um
// container novo (ou um volume recém-criado) ficaria até 15 minutos sem
// nenhum dado persistido, já que a expressão cron de 15 em 15 minutos só
// dispara no próximo múltiplo do relógio, nunca imediatamente ao subir.
export function startScheduler() {
  runSyncCycle().catch((err) => console.error("[scheduler] falha na sincronização inicial:", err));

  cron.schedule("*/15 * * * *", () => {
    runSyncCycle().catch((err) => console.error("[scheduler] falha na sincronização periódica:", err));
  });

  console.log(`[scheduler] iniciado: TTL de ${TTL_MINUTES} min por indicador.`);
}
