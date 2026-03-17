import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service";
import { verifyRefreshToken } from "../token/token.service";
import { signAccessToken } from "../../common/utils/jwt.utils";
import { revokeRefreshToken } from "../token/token.service";
export const registerController = async (req: Request, res: Response) => {

  const user = await registerService(req.body);

  res.json({
    success: true,
    data: user
  });
};

export const loginController = async (req: Request, res: Response) => {

  const data = await loginService(req.body);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    success: true,
    accessToken: data.accessToken,
    user: data.user
  });
};

export const refreshController = async (
  req: Request,
  res: Response
) => {

  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).json({
      message: "No refresh token"
    });

  const decoded: any = await verifyRefreshToken(token);

  const accessToken = signAccessToken({
    id: decoded.id
  });

  res.json({
    accessToken
  });

};
export const logoutController = async (
  req: Request,
  res: Response
) => {

  const token = req.cookies.refreshToken;

  if (token) {
    await revokeRefreshToken(token);
  }

  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out"
  });

};