"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            return;
        }
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB Error", error);
        throw error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.config.js.map