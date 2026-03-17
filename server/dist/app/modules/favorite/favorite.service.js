"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.toggleFavorite = void 0;
const favorite_model_1 = require("./favorite.model");
const toggleFavorite = async (userId, petId) => {
    const existing = await favorite_model_1.Favorite.findOne({
        user: userId,
        pet: petId
    });
    if (existing) {
        await existing.deleteOne();
        return { favorited: false };
    }
    await favorite_model_1.Favorite.create({
        user: userId,
        pet: petId
    });
    return { favorited: true };
};
exports.toggleFavorite = toggleFavorite;
const getFavorites = async (userId) => {
    return favorite_model_1.Favorite.find({ user: userId }).populate("pet");
};
exports.getFavorites = getFavorites;
//# sourceMappingURL=favorite.service.js.map