"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const signAccessToken = (payload) => {
    const options = {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    };
    return jsonwebtoken_1.default.sign(payload, accessSecret, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const options = {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    };
    return jsonwebtoken_1.default.sign(payload, refreshSecret, options);
};
exports.signRefreshToken = signRefreshToken;
//# sourceMappingURL=jwt.utils.js.map