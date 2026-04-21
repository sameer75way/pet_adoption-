import { AppError } from "./AppError";

export const badRequest = (message: string, details?: unknown) =>
  new AppError(message, 400, details);

export const unauthorized = (message: string, details?: unknown) =>
  new AppError(message, 401, details);

export const forbidden = (message: string, details?: unknown) =>
  new AppError(message, 403, details);

export const notFound = (message: string, details?: unknown) =>
  new AppError(message, 404, details);

export const conflict = (message: string, details?: unknown) =>
  new AppError(message, 409, details);

export const serviceUnavailable = (message: string, details?: unknown) =>
  new AppError(message, 503, details);

