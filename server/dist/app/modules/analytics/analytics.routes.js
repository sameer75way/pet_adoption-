"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const rbac_middleware_1 = require("../../common/middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.get("/overview", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin"]), analytics_controller_1.overviewController);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map