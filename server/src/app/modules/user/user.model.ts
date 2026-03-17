import { Schema, model } from "mongoose";

export type UserRole = "Admin" | "Staff" | "Adopter";

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isVerified: boolean;

  isFosterApproved: boolean;   
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Staff", "Adopter"],
      default: "Adopter"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isFosterApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
