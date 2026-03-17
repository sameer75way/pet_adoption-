import { Request, Response } from "express";
import * as messageService from "./message.service";

export const getConversationsController = async (
  req: Request,
  res: Response
) => {

  const user = (req as any).user;

  const conversations =
    await messageService.getConversations(user.id);

  res.json({
    success: true,
    data: conversations
  });

};

export const createConversationController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;
  const conversation = await messageService.createConversation(
    user.id,
    req.body.participantIds || [],
    req.body.relatedApplication
  );

  res.status(201).json({
    success: true,
    data: conversation
  });
};

export const getMessagesController = async (
  req: Request,
  res: Response
) => {

  const messages =
    await messageService.getMessages(
      req.params.conversationId as string
    );

  res.json({
    success: true,
    data: messages
  });

};

export const sendMessageController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;
  const message = await messageService.sendMessage(
    req.params.conversationId as string,
    user.id,
    req.body.content
  );

  res.status(201).json({
    success: true,
    data: message
  });
};
