"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = "Success") => {
    return res.status(200).json({
        success: true,
        message,
        data
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = "Error", status = 400) => {
    return res.status(status).json({
        success: false,
        message
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.utils.js.map