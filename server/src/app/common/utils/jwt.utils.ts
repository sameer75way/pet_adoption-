import jwt, { SignOptions } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

export const signAccessToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, accessSecret, options);
};

export const signRefreshToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, refreshSecret, options);
};