import { Router } from "express";
import * as messageController from "./message.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

router.get(
  "/conversations",
  authMiddleware,
  messageController.getConversationsController
);

router.post(
  "/conversations",
  authMiddleware,
  messageController.createConversationController
);

router.get(
  "/:conversationId",
  authMiddleware,
  messageController.getMessagesController
);

router.post(
  "/:conversationId",
  authMiddleware,
  messageController.sendMessageController
);

export default router;
