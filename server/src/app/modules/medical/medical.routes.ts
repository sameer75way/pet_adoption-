import { Router } from "express";
import * as medicalController from "./medical.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { createMedicalRecordSchema } from "./validation/medical.schema";

const router = Router();

router.get(
  "/records",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  medicalController.getAllMedicalRecordsController
);

router.get(
  "/:petId/records",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  medicalController.getMedicalHistoryController
);

router.post(
  "/:petId/records",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  validate(createMedicalRecordSchema),
  medicalController.addMedicalRecordController
);

router.get(
  "/:petId/summary",
  medicalController.getMedicalSummaryController
);

export default router;
