import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../common/middlewares/validate.middleware";
import { chatSchema } from "./validation/chat.schema";
import { chatController, chatStatusController } from "./chat.controller";

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", limiter, validate(chatSchema), chatController);
router.get("/status", chatStatusController);

export default router;
