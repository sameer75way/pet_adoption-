import { Schema, model, Types } from "mongoose";

export interface IMessage {

  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  content: string;

  isRead: boolean;

  readAt?: Date;

}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    content: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: Date
  },
  { timestamps: true }
);

export const Message = model<IMessage>(
  "Message",
  messageSchema
);