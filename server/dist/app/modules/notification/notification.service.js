"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationRead = exports.getNotifications = exports.createNotification = void 0;
const notification_model_1 = require("./notification.model");
const socket_1 = require("../message/socket");
const createNotification = async (userId, title, message) => {
    const notification = await notification_model_1.Notification.create({
        user: userId,
        title,
        message
    });
    (0, socket_1.emitToUser)(userId, "notification:new", notification);
    return notification;
};
exports.createNotification = createNotification;
const getNotifications = async (userId) => {
    return notification_model_1.Notification.find({ user: userId })
        .sort({ createdAt: -1 });
};
exports.getNotifications = getNotifications;
const markNotificationRead = async (notificationId, userId) => {
    const notification = await notification_model_1.Notification.findOneAndUpdate({
        _id: notificationId,
        user: userId
    }, { isRead: true }, { returnDocument: "after" });
    if (!notification) {
        throw new Error("Notification not found");
    }
    if (notification?.user) {
        (0, socket_1.emitToUser)(notification.user.toString(), "notification:updated", notification);
    }
    return notification;
};
exports.markNotificationRead = markNotificationRead;
//# sourceMappingURL=notification.service.js.map