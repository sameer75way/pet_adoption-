"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const cloudinary_config_2 = require("../config/cloudinary.config");
const httpErrors_1 = require("../errors/httpErrors");
const cloudinaryStorage = require("multer-storage-cloudinary");
const uploadsEnabled = (0, cloudinary_config_2.isCloudinaryConfigured)();
const storage = uploadsEnabled
    ? cloudinaryStorage({
        cloudinary: cloudinary_config_1.default,
        params: async () => ({
            folder: "pet-adoption/pets",
            allowed_formats: ["jpg", "png", "jpeg"],
        }),
    })
    : multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, _file, cb) => {
        if (!uploadsEnabled) {
            cb((0, httpErrors_1.serviceUnavailable)("Image upload is unavailable (Cloudinary is not configured)"));
            return;
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.middleware.js.map