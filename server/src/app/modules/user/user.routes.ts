import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/rbac.middleware";
import { User } from "./user.model";

const router = Router();

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (Admin only)
router.get("/", authMiddleware, requireRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify user account (Admin only)
router.patch("/:id/verify", authMiddleware, requireRole(["Admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
