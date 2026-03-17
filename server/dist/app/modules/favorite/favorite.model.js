"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const mongoose_1 = require("mongoose");
const favoriteSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    }
}, { timestamps: true });
favoriteSchema.index({ user: 1, pet: 1 }, { unique: true });
exports.Favorite = (0, mongoose_1.model)("Favorite", favoriteSchema);
//# sourceMappingURL=favorite.model.js.map