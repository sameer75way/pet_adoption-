"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const signAccessToken = (payload) => {
    const env = (0, env_config_1.getEnv)();
    const options = {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, env.JWT_ACCESS_SECRET, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const env = (0, env_config_1.getEnv)();
    const options = {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, env.JWT_REFRESH_SECRET, options);
};
exports.signRefreshToken = signRefreshToken;
//# sourceMappingURL=jwt.utils.js.map