import jwt from "jsonwebtoken";
import { RefreshToken } from "./refreshToken.model";
import { getEnv } from "../../common/config/env.config";
import { unauthorized } from "../../common/errors/httpErrors";

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
    throw unauthorized("Invalid refresh token");
  }

  const decoded = jwt.verify(
    token,
    getEnv().JWT_REFRESH_SECRET
  );

  return decoded;

};

export const revokeRefreshToken = async (token: string) => {

  await RefreshToken.deleteOne({ token });

};