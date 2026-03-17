import { Notification } from "./notification.model";
import { emitToUser } from "../message/socket";

export const createNotification = async (
  userId: string,
  title: string,
  message: string
) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message
  });

  emitToUser(userId, "notification:new", notification);

  return notification;

};

export const getNotifications = async (userId: string) => {

  return Notification.find({ user: userId })
    .sort({ createdAt: -1 });

};

export const markNotificationRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId
    },
    { isRead: true },
    { returnDocument: "after" }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification?.user) {
    emitToUser(notification.user.toString(), "notification:updated", notification);
  }

  return notification;
};
