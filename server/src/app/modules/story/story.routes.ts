import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";
import {
  createStoryController,
  deleteStoryController,
  getStoriesController,
  updateStoryController
} from "./story.controller";

const router = Router();

router.get("/", getStoriesController);
router.post(
  "/",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  createStoryController
);
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  updateStoryController
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  deleteStoryController
);

export default router;
