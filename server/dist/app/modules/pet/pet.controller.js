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
exports.setPrimaryPhotoController = exports.deletePetPhotoController = exports.uploadPetPhotoController = exports.updatePetStatusController = exports.deletePetController = exports.updatePetController = exports.getPetByIdController = exports.getPetsController = exports.createPetController = void 0;
const petService = __importStar(require("./pet.service"));
const socket_1 = require("../message/socket");
/* =========================
   CREATE PET
========================= */
const createPetController = async (req, res, next) => {
    try {
        const user = req.user;
        const pet = await petService.createPet({
            ...req.body,
            createdBy: user.id
        });
        res.status(201).json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "created", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.createPetController = createPetController;
/* =========================
   GET ALL PETS (SEARCH)
========================= */
const getPetsController = async (req, res) => {
    const result = await petService.getPets(req.query);
    res.json(result);
};
exports.getPetsController = getPetsController;
/* =========================
   GET PET BY ID
========================= */
const getPetByIdController = async (req, res, next) => {
    try {
        const pet = await petService.getPetById(req.params.id);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "updated", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.getPetByIdController = getPetByIdController;
/* =========================
   UPDATE PET
========================= */
const updatePetController = async (req, res, next) => {
    try {
        const pet = await petService.updatePet(req.params.id, req.body);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "deleted", petId: req.params.id });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePetController = updatePetController;
/* =========================
   DELETE PET (SOFT DELETE)
========================= */
const deletePetController = async (req, res, next) => {
    try {
        const pet = await petService.deletePet(req.params.id);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "status", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePetController = deletePetController;
/* =========================
   UPDATE PET STATUS
========================= */
const updatePetStatusController = async (req, res, next) => {
    try {
        const { status } = req.body;
        const pet = await petService.updatePetStatus(req.params.id, status);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "updated", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePetStatusController = updatePetStatusController;
/* =========================
   UPLOAD PET PHOTO
========================= */
const uploadPetPhotoController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const pet = await petService.addPetPhoto(req.params.id, req.file);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "updated", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadPetPhotoController = uploadPetPhotoController;
/* =========================
   DELETE PET PHOTO
========================= */
const deletePetPhotoController = async (req, res, next) => {
    try {
        const pet = await petService.deletePetPhoto(req.params.id, req.params.photoId);
        res.json({
            success: true,
            data: pet
        });
        (0, socket_1.emitPetsUpdated)({ type: "updated", pet });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePetPhotoController = deletePetPhotoController;
/* =========================
   SET PRIMARY PHOTO
========================= */
const setPrimaryPhotoController = async (req, res, next) => {
    try {
        const pet = await petService.setPrimaryPhoto(req.params.id, req.params.photoId);
        res.json({
            success: true,
            data: pet
        });
    }
    catch (error) {
        next(error);
    }
};
exports.setPrimaryPhotoController = setPrimaryPhotoController;
//# sourceMappingURL=pet.controller.js.map