import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

import { connectDB } from "./app/common/config/db.config";
import { getRedisClient } from "./app/common/config/redis.config";
import { initSocket } from "./app/modules/message/socket";

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
|
| Express runs inside Node's HTTP server so Socket.IO can attach to it.
|
*/

const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| Initialize Socket.IO
|--------------------------------------------------------------------------
|
| This attaches the real-time messaging system.
|
*/

initSocket(server);

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
    await connectDB();
    console.log("MongoDB connected");

    // Redis connection - ioredis connects automatically
    getRedisClient();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error("Server failed to start:", error);
    process.exit(1);

  }
};

startServer();