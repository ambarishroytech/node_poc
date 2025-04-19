// Routes for messages (e.g., /groups/{group_id}/messages).
import express from "express";
import { SendMessageDto } from "../../dtos/message.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post(
	"/groups/:group_id/messages",
	validateDto(SendMessageDto),
	(req, res) => {
		// Handle sending message logic here
		res.status(201).json({ message: "Message sent successfully." });
	},
);

export default router;
