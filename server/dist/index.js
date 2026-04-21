"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./app/common/config/db.config");
const redis_config_1 = require("./app/common/config/redis.config");
const socket_1 = require("./app/modules/message/socket");
const env_config_1 = require("./app/common/config/env.config");
let PORT = 5000;
try {
    const env = (0, env_config_1.getEnv)();
    PORT = env.PORT;
}
catch (error) {
    console.error("Invalid environment configuration:", error);
    process.exit(1);
}
/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
|
| Express runs inside Node's HTTP server so Socket.IO can attach to it.
|
*/
const server = http_1.default.createServer(app_1.default);
/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
|
| This attaches the real-time messaging system.
|
*/
(0, socket_1.initSocket)(server);
/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
|
*/
const startServer = async () => {
    try {
        console.log("Starting server...");
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
        const connectDbWithRetry = async () => {
            try {
                await (0, db_config_1.connectDB)();
                console.log("MongoDB connected");
            }
            catch (error) {
                console.error("MongoDB connection failed (retrying in 5s):", error);
                setTimeout(connectDbWithRetry, 5000);
            }
        };
        // Start connecting to MongoDB in the background (keeps server up for /health)
        void connectDbWithRetry();
        // Redis connection - optional
        (0, redis_config_1.getRedisClient)();
    }
    catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map