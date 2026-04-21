"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("./env.config");
const isCloudinaryConfigured = () => {
    const env = (0, env_config_1.getEnv)();
    return Boolean(env.CLOUDINARY_CLOUD_NAME &&
        env.CLOUDINARY_API_KEY &&
        env.CLOUDINARY_API_SECRET);
};
exports.isCloudinaryConfigured = isCloudinaryConfigured;
if ((0, exports.isCloudinaryConfigured)()) {
    const env = (0, env_config_1.getEnv)();
    cloudinary_1.v2.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
    });
}
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.config.js.map