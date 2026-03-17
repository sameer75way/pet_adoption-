"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const validate_middleware_1 = require("../../common/middlewares/validate.middleware");
const auth_schema_1 = require("./validation/auth.schema");
const auth_schema_2 = require("./validation/auth.schema");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_middleware_1.validate)(auth_schema_1.registerSchema), auth_controller_1.registerController);
router.post("/login", (0, validate_middleware_1.validate)(auth_schema_2.loginSchema), auth_controller_1.loginController);
router.post("/refresh", auth_controller_1.refreshController);
router.post("/logout", auth_middleware_1.authMiddleware, auth_controller_1.logoutController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map