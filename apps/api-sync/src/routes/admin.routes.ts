import { Router } from "express";
import { syncStateRepository, INDICATORS_CATALOG } from "@pulse-fx/core";
import { syncAll } from "../services/sync.service";
import { adminAuth } from "../middlewares/adminAuth";

const TTL_MINUTES = Number(process.env.SYNC_TTL_MINUTES);

export const adminRouter = Router();

adminRouter.use(adminAuth);

adminRouter.post("/sync", async (req, res) => {
  const force = req.query.force === "true";
  const results = await syncAll({ force, ttlMinutes: TTL_MINUTES });
  res.json({ results });
});

adminRouter.get("/sync/status", async (_req, res) => {
  const statuses = await Promise.all(
    INDICATORS_CATALOG.map(async (i) => ({
      code: i.code,
      ...(await syncStateRepository.get(i.code)),
    }))
  );
  res.json(statuses);
});
