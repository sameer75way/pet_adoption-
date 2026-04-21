"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = require("../token/token.service");
const user_model_1 = require("../user/user.model");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const env_config_1 = require("../../common/config/env.config");
const httpErrors_1 = require("../../common/errors/httpErrors");
const registerService = async (data) => {
    const existingUser = await user_model_1.User.findOne({ email: data.email });
    if (existingUser) {
        throw (0, httpErrors_1.conflict)("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, (0, env_config_1.getEnv)().BCRYPT_ROUNDS);
    const user = await user_model_1.User.create({
        ...data,
        password: hashedPassword,
        role: data.role || "Adopter"
    });
    return user;
};
exports.registerService = registerService;
const loginService = async (data) => {
    const user = await user_model_1.User.findOne({ email: data.email });
    if (!user)
        throw (0, httpErrors_1.unauthorized)("Invalid credentials");
    const match = await bcrypt_1.default.compare(data.password, user.password);
    if (!match)
        throw (0, httpErrors_1.unauthorized)("Invalid credentials");
    const accessToken = (0, jwt_utils_1.signAccessToken)({
        id: user._id,
        role: user.role
    });
    const refreshToken = (0, jwt_utils_1.signRefreshToken)({
        id: user._id
    });
    await (0, token_service_1.storeRefreshToken)(user._id.toString(), refreshToken);
    return {
        user,
        accessToken,
        refreshToken
    };
};
exports.loginService = loginService;
//# sourceMappingURL=auth.service.js.map