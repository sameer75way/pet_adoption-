"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const rbac_middleware_1 = require("../../common/middlewares/rbac.middleware");
const story_controller_1 = require("./story.controller");
const router = (0, express_1.Router)();
router.get("/", story_controller_1.getStoriesController);
router.post("/", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), story_controller_1.createStoryController);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), story_controller_1.updateStoryController);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin", "Staff"]), story_controller_1.deleteStoryController);
exports.default = router;
//# sourceMappingURL=story.routes.js.map