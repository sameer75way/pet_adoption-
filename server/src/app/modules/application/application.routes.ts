import { Router } from "express";
import * as applicationController from "./application.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { createApplicationSchema } from "./validation/application.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["Adopter"]),
  validate(createApplicationSchema),
  applicationController.submitApplicationController
);

router.get(
  "/my",
  authMiddleware,
  requireRole(["Adopter"]),
  applicationController.getMyApplicationsController
);

router.get(
  "/",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  applicationController.getApplicationsController
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  applicationController.updateApplicationStatusController
);

export default router;
