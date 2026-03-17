"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const rbac_middleware_1 = require("../../common/middlewares/rbac.middleware");
const user_model_1 = require("./user.model");
const router = (0, express_1.Router)();
// Get current user
router.get("/me", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await user_model_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Get all users (Admin only)
router.get("/", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin"]), async (req, res) => {
    try {
        const users = await user_model_1.User.find().select("-password");
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Verify user account (Admin only)
router.patch("/:id/verify", auth_middleware_1.authMiddleware, (0, rbac_middleware_1.requireRole)(["Admin"]), async (req, res) => {
    try {
        const user = await user_model_1.User.findByIdAndUpdate(req.params.id, { isVerified: true }, { returnDocument: "after" }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map