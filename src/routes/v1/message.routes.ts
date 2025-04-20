// Routes for messages (e.g., /groups/{group_id}/messages).
import express from "express";
import { SendMessageDto } from "../../dtos/message.dto";
import { validateDto } from "../../middlewares/validation.middleware";
import {
	SendErrorResponse,
	SendSuccessResponse,
} from "../../utils/response.util";

const router = express.Router();

router.post(
	"/groups/:group_id/messages",
	validateDto(SendMessageDto),
	(req, res) => {
		// Handle sending message logic here

		SendSuccessResponse(
			res,
			{ message: "Message sent successfully." },
			"Message sent successfully.",
			201,
		);
	},
);

export default router;
