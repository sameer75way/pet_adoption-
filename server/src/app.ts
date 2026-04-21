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

const parseAllowedOrigins = (raw: string | undefined) => {
  const value = (raw || "*").trim();
  if (!value) {
    return true;
  }

  const parts = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item === "*" ? "*" : item.replace(/\/$/, "")));

  if (parts.length === 0 || parts.includes("*")) {
    return true;
  }

  return parts;
};

app.use(
  cors({
    origin: parseAllowedOrigins(getEnv().CLIENT_URL),
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
