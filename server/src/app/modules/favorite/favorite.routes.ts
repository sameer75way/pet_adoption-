import { Router } from "express";
import * as favoriteController from "./favorite.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  favoriteController.getFavoritesController
);

router.post(
  "/:petId",
  authMiddleware,
  favoriteController.toggleFavoriteController
);

export default router;