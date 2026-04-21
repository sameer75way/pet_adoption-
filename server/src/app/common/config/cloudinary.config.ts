import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "./env.config";

export const isCloudinaryConfigured = () => {
  const env = getEnv();
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  const env = getEnv();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME!,
    api_key: env.CLOUDINARY_API_KEY!,
    api_secret: env.CLOUDINARY_API_SECRET!,
  });
}

export default cloudinary;
