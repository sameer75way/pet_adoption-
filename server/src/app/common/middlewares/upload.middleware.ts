import multer, { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.config";

const cloudinaryStorage = require("multer-storage-cloudinary");

const storage = cloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "pet-adoption/pets",
    allowed_formats: ["jpg", "png", "jpeg"]
  })
}) as unknown as StorageEngine;

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});