// Routes for group operations (e.g., /groups).
import express from "express";
import { GroupController } from "../../controllers/group.controller";
import { CreateGroupDto } from "../../dtos/group.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

const groupController = new GroupController();

router.post(
	"/create",
	validateDto(CreateGroupDto),
	groupController.createGroup,
);

export default router;
