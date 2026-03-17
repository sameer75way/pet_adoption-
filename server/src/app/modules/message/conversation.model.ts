import { Schema, model, Types } from "mongoose";

export interface IConversation {

  participants: Types.ObjectId[];

  relatedApplication?: Types.ObjectId;

  lastMessage?: {
    content: string;
    sentAt: Date;
    sentBy: Types.ObjectId;
  };

}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    relatedApplication: {
      type: Schema.Types.ObjectId,
      ref: "Application"
    },

    lastMessage: {
      content: String,
      sentAt: Date,
      sentBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);