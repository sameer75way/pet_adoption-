"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.refreshController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const token_service_1 = require("../token/token.service");
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const token_service_2 = require("../token/token.service");
const registerController = async (req, res) => {
    const user = await (0, auth_service_1.registerService)(req.body);
    res.json({
        success: true,
        data: user
    });
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    const data = await (0, auth_service_1.loginService)(req.body);
    res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "strict"
    });
    res.json({
        success: true,
        accessToken: data.accessToken,
        user: data.user
    });
};
exports.loginController = loginController;
const refreshController = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json({
            message: "No refresh token"
        });
    const decoded = await (0, token_service_1.verifyRefreshToken)(token);
    const accessToken = (0, jwt_utils_1.signAccessToken)({
        id: decoded.id
    });
    res.json({
        accessToken
    });
};
exports.refreshController = refreshController;
const logoutController = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        await (0, token_service_2.revokeRefreshToken)(token);
    }
    res.clearCookie("refreshToken");
    res.json({
        message: "Logged out"
    });
};
exports.logoutController = logoutController;
//# sourceMappingURL=auth.controller.js.map