import type { NextFunction, Request, Response } from "express";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const providedKey = req.header("X-Admin-Key");

  if (!ADMIN_API_KEY || providedKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}
