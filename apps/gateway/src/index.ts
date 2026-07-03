import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());

const API_PUBLIC_URL = process.env.API_PUBLIC_URL || "http://localhost:4001";
const API_SYNC_URL = process.env.API_SYNC_URL || "http://localhost:4002";

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Rotas públicas do dashboard/detalhe/favoritos
app.use(
  "/api",
  createProxyMiddleware({
    target: API_PUBLIC_URL,
    changeOrigin: true,
  })
);

// Rotas administrativas protegidas (o api-sync valida o X-Admin-Key)
app.use(
  "/admin",
  createProxyMiddleware({
    target: API_SYNC_URL,
    changeOrigin: true,
  })
);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`gateway ouvindo na porta ${PORT}`));
