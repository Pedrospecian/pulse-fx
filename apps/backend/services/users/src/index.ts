import express from "express";
import { Pool } from "pg";
import { publishEvent, subscribe } from "./messaging";

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/users", async (_req, res) => {
  const { rows } = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY id");
  res.json(rows);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ error: "name e email são obrigatórios" });
  }

  const { rows } = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
    [name, email]
  );
  const user = rows[0];
  
  await publishEvent("user.created", user);

  res.status(201).json(user);
});

// Exemplo: reagir a eventos publicados por outros microsserviços
subscribe("users.order-events", ["order.created"], async (routingKey, payload) => {
  console.log(`[service-users] evento recebido (${routingKey}):`, payload);
});

const PORT = Number(process.env.PORT) || 4001;
app.listen(PORT, () => console.log(`service-users ouvindo na porta ${PORT}`));
