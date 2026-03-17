import { Router } from "express";
import * as fosterController from "./foster.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";

const router = Router();

router.get(
  "/assignments",
  authMiddleware,
  fosterController.getAssignmentsController
);

router.post(
  "/register",
  authMiddleware,
  requireRole(["Adopter"]),
  fosterController.registerFosterController
);

router.patch(
  "/:id/approve",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  fosterController.approveFosterController
);

router.post(
  "/assignments",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  fosterController.assignPetController
);

router.patch(
  "/assignments/:id/return",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  fosterController.returnPetController
);

export default router;
