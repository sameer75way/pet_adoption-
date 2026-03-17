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
exports.getFavoritesController = exports.toggleFavoriteController = void 0;
const favoriteService = __importStar(require("./favorite.service"));
const socket_1 = require("../message/socket");
const toggleFavoriteController = async (req, res) => {
    const user = req.user;
    const result = await favoriteService.toggleFavorite(user.id, req.params.petId);
    (0, socket_1.emitToUser)(user.id, "favorite:updated", {
        petId: req.params.petId,
        ...result
    });
    res.json({
        success: true,
        data: result
    });
};
exports.toggleFavoriteController = toggleFavoriteController;
const getFavoritesController = async (req, res) => {
    const user = req.user;
    const favorites = await favoriteService.getFavorites(user.id);
    res.json({
        success: true,
        data: favorites
    });
};
exports.getFavoritesController = getFavoritesController;
//# sourceMappingURL=favorite.controller.js.map