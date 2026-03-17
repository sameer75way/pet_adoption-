"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const mongoose_1 = require("mongoose");
const storySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    petName: {
        type: String,
        trim: true
    },
    adopterName: {
        type: String,
        trim: true
    },
    published: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});
exports.Story = (0, mongoose_1.model)("Story", storySchema);
//# sourceMappingURL=story.model.js.map