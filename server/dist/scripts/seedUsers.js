"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../app/modules/user/user.model");
const db_config_1 = require("../app/common/config/db.config");
const seedUsers = async () => {
    try {
        await (0, db_config_1.connectDB)();
        const hashedPassword = await bcrypt_1.default.hash("password", 12);
        const demoUsers = [
            {
                name: "Admin User",
                email: "admin@petadopt.com",
                password: hashedPassword,
                role: "Admin",
                isVerified: true
            },
            {
                name: "Staff User",
                email: "staff@petadopt.com",
                password: hashedPassword,
                role: "Staff",
                isVerified: true
            },
            {
                name: "Adopter User",
                email: "adopter@petadopt.com",
                password: hashedPassword,
                role: "Adopter",
                isVerified: true
            }
        ];
        for (const userData of demoUsers) {
            const existingUser = await user_model_1.User.findOne({ email: userData.email });
            if (!existingUser) {
                await user_model_1.User.create(userData);
                console.log(`Created ${userData.role} user: ${userData.email}`);
            }
            else {
                console.log(`${userData.role} user already exists: ${userData.email}`);
            }
        }
        console.log("\nDemo users seeded successfully!");
        console.log("\nLogin credentials:");
        console.log("Admin: admin@petadopt.com / password");
        console.log("Staff: staff@petadopt.com / password");
        console.log("Adopter: adopter@petadopt.com / password");
        process.exit(0);
    }
    catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};
seedUsers();
//# sourceMappingURL=seedUsers.js.map