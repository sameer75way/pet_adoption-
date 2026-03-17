"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageController = exports.getMessagesController = exports.createConversationController = exports.getConversationsController = void 0;
const messageService = __importStar(require("./message.service"));
const getConversationsController = async (req, res) => {
    const user = req.user;
    const conversations = await messageService.getConversations(user.id);
    res.json({
        success: true,
        data: conversations
    });
};
exports.getConversationsController = getConversationsController;
const createConversationController = async (req, res) => {
    const user = req.user;
    const conversation = await messageService.createConversation(user.id, req.body.participantIds || [], req.body.relatedApplication);
    res.status(201).json({
        success: true,
        data: conversation
    });
};
exports.createConversationController = createConversationController;
const getMessagesController = async (req, res) => {
    const user = req.user;
    const messages = await messageService.getMessages(req.params.conversationId, user.id);
    res.json({
        success: true,
        data: messages
    });
};
exports.getMessagesController = getMessagesController;
const sendMessageController = async (req, res) => {
    const user = req.user;
    const message = await messageService.sendMessage(req.params.conversationId, user.id, req.body.content);
    res.status(201).json({
        success: true,
        data: message
    });
};
exports.sendMessageController = sendMessageController;
//# sourceMappingURL=message.controller.js.map