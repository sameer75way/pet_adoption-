import { Router } from "express";
import { overviewController } from "./analytics.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";

const router = Router();

router.get(
  "/overview",
  authMiddleware,
  requireRole(["Admin"]),
  overviewController
);

export default router;