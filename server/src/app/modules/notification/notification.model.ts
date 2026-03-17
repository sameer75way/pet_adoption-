import { Schema, model, Types } from "mongoose";

export interface INotification {

  user: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;

}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    title: String,

    message: String,

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);