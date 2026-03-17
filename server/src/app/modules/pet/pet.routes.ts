import { Router } from "express";
import * as petController from "./pet.controller";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";
import { validate } from "../../common/middlewares/validate.middleware";

import { createPetSchema } from "./validation/pet.schema";
import { upload } from "../../common/middlewares/upload.middleware";

const router = Router();

/* =========================
   PUBLIC ROUTES
========================= */

/* GET ALL PETS (SEARCH + FILTER) */
router.get("/", petController.getPetsController);

/* GET PET BY ID */
router.get("/:id", petController.getPetByIdController);

/* =========================
   PROTECTED ROUTES (STAFF / ADMIN)
========================= */

/* CREATE PET */
router.post(
  "/",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  validate(createPetSchema),
  petController.createPetController
);

/* UPDATE PET */
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  petController.updatePetController
);

/* DELETE PET (SOFT DELETE) */
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["Admin"]),
  petController.deletePetController
);

/* UPDATE PET STATUS */
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  petController.updatePetStatusController
);

/* =========================
   PHOTO ROUTES
========================= */

/* UPLOAD PHOTO */
router.post(
  "/:id/photos",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  upload.single("photo"),
  petController.uploadPetPhotoController
);

/* DELETE PHOTO */
router.delete(
  "/:id/photos/:photoId",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  petController.deletePetPhotoController
);

/* SET PRIMARY PHOTO */
router.patch(
  "/:id/photos/:photoId/primary",
  authMiddleware,
  requireRole(["Admin", "Staff"]),
  petController.setPrimaryPhotoController
);

export default router;