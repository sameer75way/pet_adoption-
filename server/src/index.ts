import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

import { connectDB } from "./app/common/config/db.config";
import { getRedisClient } from "./app/common/config/redis.config";
import { initSocket } from "./app/modules/message/socket";
import { getEnv } from "./app/common/config/env.config";

let PORT = 5000;

try {
  const env = getEnv();
  PORT = env.PORT;
} catch (error) {
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

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        process.exit(0);
      });

      // Force shutdown if server doesn't close (e.g. open keep-alive connections)
      setTimeout(() => {
        process.exit(1);
      }, 5000).unref();
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

    const connectDbWithRetry = async () => {
      try {
        await connectDB();
        console.log("MongoDB connected");
      } catch (error) {
        console.error("MongoDB connection failed (retrying in 5s):", error);
        setTimeout(connectDbWithRetry, 5000);
      }
    };

    // Start connecting to MongoDB in the background (keeps server up for /health)
    void connectDbWithRetry();

    // Redis connection - optional
    getRedisClient();

  } catch (error) {

    console.error("Server failed to start:", error);
    process.exit(1);

  }
};

startServer();
