import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import * as notificationController from "./notification.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  notificationController.getNotificationsController
);

router.patch(
  "/:id/read",
  authMiddleware,
  notificationController.markNotificationReadController
);

export default router;
