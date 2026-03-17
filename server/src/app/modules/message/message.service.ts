import { Message } from "./message.model";
import { Conversation } from "./conversation.model";
import { emitToConversation, emitToUser } from "./socket";

const ensureConversationParticipant = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversation;
};

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

export const getMessages = async (
  conversationId: string,
  userId: string
) => {
  await ensureConversationParticipant(conversationId, userId);

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
  await ensureConversationParticipant(conversationId, senderId);

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

  const populatedMessage = await Message.findById(message._id).populate("sender");
  const conversation = await Conversation.findById(conversationId).populate("participants");

  emitToConversation(conversationId, "message:received", populatedMessage);

  if (conversation) {
    emitToConversation(conversationId, "conversation:updated", conversation);

    conversation.participants.forEach((participant: any) => {
      const participantId = participant?._id?.toString?.() || participant?.toString?.();
      if (participantId) {
        emitToUser(participantId, "conversation:updated", conversation);
      }
    });
  }

  return populatedMessage;

};
