import Redis from "ioredis";
import { getEnv } from "./env.config";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!redisClient) {
    const { REDIS_URL } = getEnv();
    if (!REDIS_URL) {
      console.log("Redis disabled (REDIS_URL not set)");
      return null;
    }

    redisClient = new Redis(REDIS_URL);
    redisClient.on("connect", () => {
      console.log("Redis connected");
    });
    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }
  return redisClient;
};
