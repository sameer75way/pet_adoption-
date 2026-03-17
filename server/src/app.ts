import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import routes from "./app/routes";
import { errorHandler } from "./app/common/middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/health", (_, res) => {
  res.send("Server running");
});

app.use(errorHandler);

export default app;
