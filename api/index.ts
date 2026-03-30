import dotenv from "dotenv";
import app from "../server/src/app";
import { connectDB } from "../server/src/app/common/config/db.config";
import { getRedisClient } from "../server/src/app/common/config/redis.config";

dotenv.config({ path: "./server/.env" });

let bootstrapPromise: Promise<void> | null = null;

const bootstrap = async () => {
  await connectDB();
  getRedisClient();
};

export default async function handler(
  request: Parameters<typeof app>[0],
  response: Parameters<typeof app>[1]
) {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }

  await bootstrapPromise;

  return app(request, response);
}
