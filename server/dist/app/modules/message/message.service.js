"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.createConversation = exports.getConversations = void 0;
const message_model_1 = require("./message.model");
const conversation_model_1 = require("./conversation.model");
const socket_1 = require("./socket");
const ensureConversationParticipant = async (conversationId, userId) => {
    const conversation = await conversation_model_1.Conversation.findOne({
        _id: conversationId,
        participants: userId
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return conversation;
};
const getConversations = async (userId) => {
    return conversation_model_1.Conversation.find({
        participants: userId
    })
        .populate("participants")
        .populate("relatedApplication")
        .sort({ updatedAt: -1 });
};
exports.getConversations = getConversations;
const createConversation = async (userId, participantIds, relatedApplication) => {
    const participants = [...new Set([userId, ...participantIds])];
    const existingConversation = await conversation_model_1.Conversation.findOne({
        participants: { $all: participants, $size: participants.length },
        ...(relatedApplication ? { relatedApplication } : {})
    })
        .populate("participants")
        .populate("relatedApplication");
    if (existingConversation) {
        return existingConversation;
    }
    const conversation = await conversation_model_1.Conversation.create({
        participants,
        relatedApplication
    });
    return conversation_model_1.Conversation.findById(conversation._id)
        .populate("participants")
        .populate("relatedApplication");
};
exports.createConversation = createConversation;
const getMessages = async (conversationId, userId) => {
    await ensureConversationParticipant(conversationId, userId);
    return message_model_1.Message.find({
        conversation: conversationId
    })
        .populate("sender")
        .sort({ createdAt: 1 });
};
exports.getMessages = getMessages;
const sendMessage = async (conversationId, senderId, content) => {
    await ensureConversationParticipant(conversationId, senderId);
    const message = await message_model_1.Message.create({
        conversation: conversationId,
        sender: senderId,
        content
    });
    await conversation_model_1.Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: {
            content,
            sentAt: new Date(),
            sentBy: senderId
        }
    });
    const populatedMessage = await message_model_1.Message.findById(message._id).populate("sender");
    const conversation = await conversation_model_1.Conversation.findById(conversationId).populate("participants");
    (0, socket_1.emitToConversation)(conversationId, "message:received", populatedMessage);
    if (conversation) {
        (0, socket_1.emitToConversation)(conversationId, "conversation:updated", conversation);
        conversation.participants.forEach((participant) => {
            const participantId = participant?._id?.toString?.() || participant?.toString?.();
            if (participantId) {
                (0, socket_1.emitToUser)(participantId, "conversation:updated", conversation);
            }
        });
    }
    return populatedMessage;
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=message.service.js.map