import { Notification } from "./notification.model";

export const createNotification = async (
  userId: string,
  title: string,
  message: string
) => {

  return Notification.create({
    user: userId,
    title,
    message
  });

};

export const getNotifications = async (userId: string) => {

  return Notification.find({ user: userId })
    .sort({ createdAt: -1 });

};

export const markNotificationRead = async (notificationId: string) => {
  return Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { returnDocument: "after" }
  );
};
