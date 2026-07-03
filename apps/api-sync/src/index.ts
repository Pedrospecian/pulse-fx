import express from "express";
import { indicatorRepository } from "@pulse-fx/core";
import { adminRouter } from "./routes/admin.routes";
import { startScheduler } from "./jobs/scheduler";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/admin", adminRouter);

const PORT = Number(process.env.PORT) || 4002;

async function bootstrap() {
  // Garante que o catálogo de indicadores exista no banco antes de tudo.
  await indicatorRepository.seedCatalog();

  startScheduler();

  app.listen(PORT, () => console.log(`api-sync ouvindo na porta ${PORT}`));
}

bootstrap().catch((err) => {
  console.error("Falha ao iniciar api-sync:", err);
  process.exit(1);
});
