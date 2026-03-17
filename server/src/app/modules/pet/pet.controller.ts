import { Request, Response, NextFunction } from "express";
import * as petService from "./pet.service";
import { emitPetsUpdated } from "../message/socket";

/* =========================
   CREATE PET
========================= */
export const createPetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const pet = await petService.createPet({
      ...req.body,
      createdBy: user.id
    });

    res.status(201).json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "created", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL PETS (SEARCH)
========================= */
export const getPetsController = async (
  req: Request,
  res: Response
) => {

  const result =
    await petService.getPets(req.query);

  res.json(result);

};

/* =========================
   GET PET BY ID
========================= */
export const getPetByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await petService.getPetById(req.params.id as string);

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "updated", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PET
========================= */
export const updatePetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await petService.updatePet(
      req.params.id as string,
      req.body
    );

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "deleted", petId: req.params.id as string });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE PET (SOFT DELETE)
========================= */
export const deletePetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await petService.deletePet(req.params.id as string);

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "status", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE PET STATUS
========================= */
export const updatePetStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    const pet = await petService.updatePetStatus(
      req.params.id as string,
      status
    );

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "updated", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPLOAD PET PHOTO
========================= */
export const uploadPetPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const pet = await petService.addPetPhoto(
      req.params.id as string,
      req.file
    );

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "updated", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE PET PHOTO
========================= */
export const deletePetPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await petService.deletePetPhoto(
      req.params.id as string,
      req.params.photoId as string
    );

    res.json({
      success: true,
      data: pet
    });
    emitPetsUpdated({ type: "updated", pet });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SET PRIMARY PHOTO
========================= */
export const setPrimaryPhotoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pet = await petService.setPrimaryPhoto(
      req.params.id as string,
      req.params.photoId as string
    );

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    next(error);
  }
};
