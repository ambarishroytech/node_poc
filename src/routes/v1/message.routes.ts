// Routes for messages (e.g., /groups/{group_id}/messages).
import express from "express";
import { MessageController } from "../../controllers/message.controller";
import { SendMessageDto } from "../../dtos/message.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();
const messageController = new MessageController();

router.post(
	"/send",
	validateDto(SendMessageDto),
	messageController.sendMessage,
);

export default router;
