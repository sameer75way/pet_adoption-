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
const PORT = process.env.PORT || 5000;
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
        // MongoDB connection
        await (0, db_config_1.connectDB)();
        console.log("MongoDB connected");
        // Redis connection - ioredis connects automatically
        (0, redis_config_1.getRedisClient)();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map