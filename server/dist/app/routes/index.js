"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const pet_routes_1 = __importDefault(require("../modules/pet/pet.routes"));
const application_routes_1 = __importDefault(require("../modules/application/application.routes"));
const medical_routes_1 = __importDefault(require("../modules/medical/medical.routes"));
const foster_routes_1 = __importDefault(require("../modules/foster/foster.routes"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const favorite_routes_1 = __importDefault(require("../modules/favorite/favorite.routes"));
const message_routes_1 = __importDefault(require("../modules/message/message.routes"));
const analytics_routes_1 = __importDefault(require("../modules/analytics/analytics.routes"));
const notification_routes_1 = __importDefault(require("../modules/notification/notification.routes"));
const story_routes_1 = __importDefault(require("../modules/story/story.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.default
    },
    {
        path: "/pets",
        route: pet_routes_1.default
    },
    {
        path: "/applications",
        route: application_routes_1.default
    },
    {
        path: "/medical",
        route: medical_routes_1.default
    },
    {
        path: "/foster",
        route: foster_routes_1.default
    },
    {
        path: "/users",
        route: user_routes_1.default
    },
    {
        path: "/favorites",
        route: favorite_routes_1.default
    },
    {
        path: "/messages",
        route: message_routes_1.default
    },
    {
        path: "/analytics",
        route: analytics_routes_1.default
    },
    {
        path: "/notifications",
        route: notification_routes_1.default
    },
    {
        path: "/stories",
        route: story_routes_1.default
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map