"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string().optional().default("development"),
    PORT: zod_1.z.coerce.number().int().positive().optional().default(5000),
    MONGODB_URI: zod_1.z.string().min(1),
    REDIS_URL: zod_1.z.string().min(1).optional(),
    CLIENT_URL: zod_1.z.string().optional().default("*"),
    BCRYPT_ROUNDS: zod_1.z.coerce.number().int().min(4).max(20).optional().default(12),
    JWT_ACCESS_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().min(1),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional(),
    CLOUDINARY_API_KEY: zod_1.z.string().optional(),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional(),
    GEMINI_API_KEY: zod_1.z.string().optional(),
    GEMINI_MODEL: zod_1.z.string().optional(),
});
let cachedEnv = null;
const getEnv = () => {
    if (cachedEnv) {
        return cachedEnv;
    }
    const parsed = envSchema.parse(process.env);
    const cloudParts = [
        parsed.CLOUDINARY_CLOUD_NAME,
        parsed.CLOUDINARY_API_KEY,
        parsed.CLOUDINARY_API_SECRET,
    ].filter((value) => Boolean(value && value.trim()));
    if (cloudParts.length > 0 && cloudParts.length < 3) {
        throw new Error("Cloudinary env is partially set. Provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or remove all three).");
    }
    cachedEnv = parsed;
    return parsed;
};
exports.getEnv = getEnv;
//# sourceMappingURL=env.config.js.map