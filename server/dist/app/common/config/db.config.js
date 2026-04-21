"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isDbConnected = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const isDbConnected = () => mongoose_1.default.connection.readyState === 1;
exports.isDbConnected = isDbConnected;
const connectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            return;
        }
        const { MONGODB_URI } = (0, env_config_1.getEnv)();
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB Error", error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.config.js.map