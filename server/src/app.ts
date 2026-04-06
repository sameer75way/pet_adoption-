import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import routes from "./app/routes";
import { errorHandler } from "./app/common/middlewares/errorHandler";

const app = express();

app.use(helmet());

const rawOrigin = process.env.CLIENT_URL || "*";
const allowedOrigin = rawOrigin !== "*" ? rawOrigin.replace(/\/$/, "") : "*";

app.use(cors({ 
  origin: allowedOrigin, 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/health", (_, res) => {
  res.send("Server running");
});

app.use(errorHandler);

export default app;
