import mongoose from "mongoose";
import { getEnv } from "./env.config";

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const { MONGODB_URI } = getEnv();
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error", error);
    throw error;
  }
};
