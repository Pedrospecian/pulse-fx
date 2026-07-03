import express from "express";
import { indicatorsRouter } from "./routes/indicators.routes";
import { startIndicatorEventsSubscriber } from "./messaging/subscriber";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(indicatorsRouter);

const PORT = Number(process.env.PORT) || 4001;

async function bootstrap() {
  await startIndicatorEventsSubscriber();
  app.listen(PORT, () => console.log(`api-public ouvindo na porta ${PORT}`));
}

bootstrap().catch((err) => {
  console.error("Falha ao iniciar api-public:", err);
  process.exit(1);
});
