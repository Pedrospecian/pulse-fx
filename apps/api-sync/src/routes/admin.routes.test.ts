import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

vi.mock("@pulse-fx/core", () => ({
  syncStateRepository: { get: vi.fn().mockResolvedValue(null) },
  INDICATORS_CATALOG: [{ code: "USD_BRL_PTAX" }],
}));

vi.mock("../services/sync.service", () => ({
  syncAll: vi.fn().mockResolvedValue([{ code: "USD_BRL_PTAX", skipped: true }]),
}));

process.env.ADMIN_API_KEY = "test-secret";

describe("adminRouter", () => {
  let app: express.Express;

  beforeEach(async () => {
    const { adminRouter } = await import("../routes/admin.routes");
    app = express();
    app.use(express.json());
    app.use("/admin", adminRouter);
  });

  it("rejeita requisição sem o header X-Admin-Key", async () => {

  });

  it("rejeita requisição com chave incorreta", async () => {

  });

  it("aceita requisição com a chave correta e dispara o sync", async () => {

  });
});
