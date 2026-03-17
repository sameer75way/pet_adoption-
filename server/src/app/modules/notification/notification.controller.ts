import { Request, Response } from "express";
import * as notificationService from "./notification.service";

export const getNotificationsController = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;
  const notifications = await notificationService.getNotifications(user.id);

  res.json({
    success: true,
    data: notifications
  });
};

export const markNotificationReadController = async (
  req: Request,
  res: Response
) => {
  const notification = await notificationService.markNotificationRead(
    req.params.id as string
  );

  res.json({
    success: true,
    data: notification
  });
};
