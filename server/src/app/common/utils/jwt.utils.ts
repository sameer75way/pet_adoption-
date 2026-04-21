import jwt, { SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env.config";

export const signAccessToken = (payload: object): string => {
  const env = getEnv();
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

export const signRefreshToken = (payload: object): string => {
  const env = getEnv();
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};
