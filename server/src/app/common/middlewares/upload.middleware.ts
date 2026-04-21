import multer, { StorageEngine } from "multer";
import cloudinary from "../config/cloudinary.config";
import { isCloudinaryConfigured } from "../config/cloudinary.config";
import { serviceUnavailable } from "../errors/httpErrors";

const cloudinaryStorage = require("multer-storage-cloudinary");

const uploadsEnabled = isCloudinaryConfigured();

const storage = uploadsEnabled
  ? (cloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: "pet-adoption/pets",
        allowed_formats: ["jpg", "png", "jpeg"],
      }),
    }) as unknown as StorageEngine)
  : multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, _file, cb) => {
    if (!uploadsEnabled) {
      cb(
        serviceUnavailable(
          "Image upload is unavailable (Cloudinary is not configured)"
        ) as unknown as Error
      );
      return;
    }
    cb(null, true);
  },
});
