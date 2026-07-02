import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:4001";

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Tudo que entrar em /api/users/* é roteado para o service-users
app.use(
  "/api/users",
  createProxyMiddleware({
    target: USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/users" },
  })
);

// Novos microsserviços = nova regra de proxy aqui, sem tocar no frontend

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`api-gateway ouvindo na porta ${PORT}`));
