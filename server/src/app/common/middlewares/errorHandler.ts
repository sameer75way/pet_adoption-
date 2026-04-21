import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(err);

  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : typeof err?.statusCode === "number"
        ? err.statusCode
        : err?.name === "ValidationError"
          ? 400
        : err?.name === "CastError"
          ? 400
          : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(err instanceof AppError && err.details ? { details: err.details } : {}),
  });
};
