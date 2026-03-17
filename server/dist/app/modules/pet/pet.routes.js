"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petController = __importStar(require("./pet.controller"));
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const rbac_middleware_1 = require("../../common/middlewares/rbac.middleware");
const validate_middleware_1 = require("../../common/middlewares/validate.middleware");
const pet_schema_1 = require("./validation/pet.schema");
const upload_middleware_1 = require("../../common/middlewares/upload.middleware");
const router = (0, express_1.Router)();
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
router.post("/", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), (0, validate_middleware_1.validate)(pet_schema_1.createPetSchema), petController.createPetController);
/* UPDATE PET */
router.patch("/:id", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), petController.updatePetController);
/* DELETE PET (SOFT DELETE) */
router.delete("/:id", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin"]), petController.deletePetController);
/* UPDATE PET STATUS */
router.patch("/:id/status", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), petController.updatePetStatusController);
/* =========================
   PHOTO ROUTES
========================= */
/* UPLOAD PHOTO */
router.post("/:id/photos", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), upload_middleware_1.upload.single("photo"), petController.uploadPetPhotoController);
/* DELETE PHOTO */
router.delete("/:id/photos/:photoId", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), petController.deletePetPhotoController);
/* SET PRIMARY PHOTO */
router.patch("/:id/photos/:photoId/primary", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), petController.setPrimaryPhotoController);
exports.default = router;
//# sourceMappingURL=pet.routes.js.map