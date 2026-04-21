"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.verifyRefreshToken = exports.storeRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_model_1 = require("./refreshToken.model");
const env_config_1 = require("../../common/config/env.config");
const httpErrors_1 = require("../../common/errors/httpErrors");
const storeRefreshToken = async (userId, token) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    await refreshToken_model_1.RefreshToken.create({
        user: userId,
        token,
        expiresAt: expires
    });
};
exports.storeRefreshToken = storeRefreshToken;
const verifyRefreshToken = async (token) => {
    const stored = await refreshToken_model_1.RefreshToken.findOne({ token });
    if (!stored) {
        throw (0, httpErrors_1.unauthorized)("Invalid refresh token");
    }
    const decoded = jsonwebtoken_1.default.verify(token, (0, env_config_1.getEnv)().JWT_REFRESH_SECRET);
    return decoded;
};
exports.verifyRefreshToken = verifyRefreshToken;
const revokeRefreshToken = async (token) => {
    await refreshToken_model_1.RefreshToken.deleteOne({ token });
};
exports.revokeRefreshToken = revokeRefreshToken;
//# sourceMappingURL=token.service.js.map