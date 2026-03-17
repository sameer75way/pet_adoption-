import jwt from "jsonwebtoken";
import { RefreshToken } from "./refreshToken.model";

export const storeRefreshToken = async (
  userId: string,
  token: string
) => {

  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt: expires
  });

};

export const verifyRefreshToken = async (token: string) => {

  const stored = await RefreshToken.findOne({ token });

  if (!stored) {
    throw new Error("Invalid refresh token");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  );

  return decoded;

};

export const revokeRefreshToken = async (token: string) => {

  await RefreshToken.deleteOne({ token });

};