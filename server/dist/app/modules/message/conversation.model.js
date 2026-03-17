"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    relatedApplication: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Application"
    },
    lastMessage: {
        content: String,
        sentAt: Date,
        sentBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User"
        }
    }
}, { timestamps: true });
exports.Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
//# sourceMappingURL=conversation.model.js.map