import { Router } from "express";
import {
  getDashboard,
  getIndicatorDetail,
  listFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/indicators.controller";

export const indicatorsRouter = Router();

indicatorsRouter.get("/indicators", getDashboard);
indicatorsRouter.get("/indicators/:code", getIndicatorDetail);
indicatorsRouter.post("/indicators/:code/favorite", addFavorite);
indicatorsRouter.delete("/indicators/:code/favorite", removeFavorite);
indicatorsRouter.get("/favorites", listFavorites);
