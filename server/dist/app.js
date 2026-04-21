"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const errorHandler_1 = require("./app/common/middlewares/errorHandler");
const env_config_1 = require("./app/common/config/env.config");
const db_config_1 = require("./app/common/config/db.config");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const parseAllowedOrigins = (raw) => {
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
app.use((0, cors_1.default)({
    origin: parseAllowedOrigins((0, env_config_1.getEnv)().CLIENT_URL),
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api", (req, res, next) => {
    if (!(0, db_config_1.isDbConnected)()) {
        return res.status(503).json({
            success: false,
            message: "Database not connected",
        });
    }
    next();
});
app.use("/api", routes_1.default);
app.get("/health", (_, res) => {
    res.json({
        ok: true,
        dbConnected: (0, db_config_1.isDbConnected)(),
    });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map