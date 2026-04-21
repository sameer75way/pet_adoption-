import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import routes from "./app/routes";
import { errorHandler } from "./app/common/middlewares/errorHandler";
import { getEnv } from "./app/common/config/env.config";
import { isDbConnected } from "./app/common/config/db.config";

const app = express();

app.use(helmet());

const rawOrigin = getEnv().CLIENT_URL || "*";
const allowedOrigin = rawOrigin !== "*" ? rawOrigin.replace(/\/$/, "") : "*";

app.use(
  cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database not connected",
    });
  }
  next();
});

app.use("/api", routes);

app.get("/health", (_, res) => {
  res.json({
    ok: true,
    dbConnected: isDbConnected(),
  });
});

app.use(errorHandler);

export default app;
