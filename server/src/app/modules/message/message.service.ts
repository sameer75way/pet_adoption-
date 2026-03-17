import { Message } from "./message.model";
import { Conversation } from "./conversation.model";

export const getConversations = async (userId: string) => {

  return Conversation.find({
    participants: userId
  })
    .populate("participants")
    .populate("relatedApplication")
    .sort({ updatedAt: -1 });

};

export const createConversation = async (
  userId: string,
  participantIds: string[],
  relatedApplication?: string
) => {
  const participants = [...new Set([userId, ...participantIds])];

  const existingConversation = await Conversation.findOne({
    participants: { $all: participants, $size: participants.length },
    ...(relatedApplication ? { relatedApplication } : {})
  })
    .populate("participants")
    .populate("relatedApplication");

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await Conversation.create({
    participants,
    relatedApplication
  });

  return Conversation.findById(conversation._id)
    .populate("participants")
    .populate("relatedApplication");
};

export const getMessages = async (conversationId: string) => {

  return Message.find({
    conversation: conversationId
  })
    .populate("sender")
    .sort({ createdAt: 1 });

};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: {
      content,
      sentAt: new Date(),
      sentBy: senderId
    }
  });

  return Message.findById(message._id).populate("sender");

};
