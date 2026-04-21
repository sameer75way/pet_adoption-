import { Request, Response, NextFunction } from "express";
import { chatWithAssistant } from "./chat.service";
import { getEnv } from "../../common/config/env.config";

export const chatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user as
      | { id: string; role: string; name?: string }
      | undefined;

    const { message, previousResponseId } = req.body as {
      message: string;
      previousResponseId?: string;
    };

    const data = await chatWithAssistant({
      message,
      previousResponseId,
      user,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const chatStatusController = (req: Request, res: Response) => {
  const env = getEnv();
  res.json({
    success: true,
    data: {
      provider: "gemini",
      model: env.GEMINI_MODEL || "gemini-2.5-flash",
      configured: Boolean(env.GEMINI_API_KEY),
    },
  });
};
