"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationRead = exports.getNotifications = exports.createNotification = void 0;
const notification_model_1 = require("./notification.model");
const createNotification = async (userId, title, message) => {
    return notification_model_1.Notification.create({
        user: userId,
        title,
        message
    });
};
exports.createNotification = createNotification;
const getNotifications = async (userId) => {
    return notification_model_1.Notification.find({ user: userId })
        .sort({ createdAt: -1 });
};
exports.getNotifications = getNotifications;
const markNotificationRead = async (notificationId) => {
    return notification_model_1.Notification.findByIdAndUpdate(notificationId, { isRead: true }, { returnDocument: "after" });
};
exports.markNotificationRead = markNotificationRead;
//# sourceMappingURL=notification.service.js.map