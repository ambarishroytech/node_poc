// Routes for group operations (e.g., /groups).
import express from "express";
import {
	CreateGroupDto,
	UpdateJoinGroupRequestDto,
} from "../../dtos/group.dto";
import { validateDto } from "../../middlewares/validation.middleware";
import {
	SendErrorResponse,
	SendSuccessResponse,
} from "../../utils/response.util";

const router = express.Router();

router.post("/groups", validateDto(CreateGroupDto), (req, res) => {
	// Handle group creation logic here

	SendSuccessResponse(
		res,
		{ group_id: 123 },
		"Group created successfully.",
		201,
	);
});

router.post(
	"/groups/:group_id/join",
	validateDto(UpdateJoinGroupRequestDto),
	(req, res) => {
		// Handle join group logic here
		SendSuccessResponse(
			res,
			{ group_id: 123 },
			"Join request submitted successfully.",
			201,
		);
	},
);

export default router;
