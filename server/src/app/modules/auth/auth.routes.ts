import { Router } from "express";
import { loginController, logoutController, refreshController, registerController } from "./auth.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validate.middleware";
import { registerSchema } from "./validation/auth.schema";
import { loginSchema } from "./validation/auth.schema";

const router = Router();
router.post(
  "/register",
  validate(registerSchema),
  registerController
);

router.post(
  "/login",
  validate(loginSchema),
  loginController
);

router.post(
  "/refresh",
  refreshController
);

router.post(
  "/logout",
  authMiddleware,
  logoutController
);
export default router;