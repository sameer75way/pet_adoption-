import Redis from "ioredis";

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL as string);
    redisClient.on("connect", () => {
      console.log("Redis connected");
    });
    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }
  return redisClient;
};