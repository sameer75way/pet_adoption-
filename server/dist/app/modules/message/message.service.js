"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.createConversation = exports.getConversations = void 0;
const message_model_1 = require("./message.model");
const conversation_model_1 = require("./conversation.model");
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
const getMessages = async (conversationId) => {
    return message_model_1.Message.find({
        conversation: conversationId
    })
        .populate("sender")
        .sort({ createdAt: 1 });
};
exports.getMessages = getMessages;
const sendMessage = async (conversationId, senderId, content) => {
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
    return message_model_1.Message.findById(message._id).populate("sender");
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=message.service.js.map