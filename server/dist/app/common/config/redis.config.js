"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_config_1 = require("./env.config");
let redisClient = null;
const getRedisClient = () => {
    if (!redisClient) {
        const { REDIS_URL } = (0, env_config_1.getEnv)();
        if (!REDIS_URL) {
            console.log("Redis disabled (REDIS_URL not set)");
            return null;
        }
        redisClient = new ioredis_1.default(REDIS_URL);
        redisClient.on("connect", () => {
            console.log("Redis connected");
        });
        redisClient.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
//# sourceMappingURL=redis.config.js.map