import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().int().positive().optional().default(5000),

  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1).optional(),

  CLIENT_URL: z.string().optional().default("*"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(20).optional().default(12),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
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
    throw new Error(
      "Cloudinary env is partially set. Provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or remove all three)."
    );
  }

  cachedEnv = parsed;
  return parsed;
};
