import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import bcrypt from "bcrypt";
import { User } from "../app/modules/user/user.model";
import { connectDB } from "../app/common/config/db.config";

const seedUsers = async () => {
  try {
    await connectDB();
    
    const hashedPassword = await bcrypt.hash("password", 12);
    
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
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created ${userData.role} user: ${userData.email}`);
      } else {
        console.log(`${userData.role} user already exists: ${userData.email}`);
      }
    }
    
    console.log("\nDemo users seeded successfully!");
    console.log("\nLogin credentials:");
    console.log("Admin: admin@petadopt.com / password");
    console.log("Staff: staff@petadopt.com / password");
    console.log("Adopter: adopter@petadopt.com / password");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
