"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err instanceof AppError_1.AppError
        ? err.statusCode
        : typeof err?.statusCode === "number"
            ? err.statusCode
            : err?.name === "CastError"
                ? 400
                : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(err instanceof AppError_1.AppError && err.details ? { details: err.details } : {}),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map