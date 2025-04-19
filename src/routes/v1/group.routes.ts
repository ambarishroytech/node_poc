// Routes for group operations (e.g., /groups).
import express from "express";
import { CreateGroupDto, JoinGroupRequestDto } from "../../dtos/group.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post("/groups", validateDto(CreateGroupDto), (req, res) => {
	// Handle group creation logic here
	res.status(201).json({ group_id: 123 });
});

router.post(
	"/groups/:group_id/join",
	validateDto(JoinGroupRequestDto),
	(req, res) => {
		// Handle join group logic here
		res.status(200).json({ message: "Join request submitted successfully." });
	},
);

export default router;
