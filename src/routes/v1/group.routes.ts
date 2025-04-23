// Routes for group operations (e.g., /groups).
import express from "express";
import { GroupController } from "../../controllers/group.controller";
import { CreateGroupDto, UpdateJoinGroupRequestDto, TransferOwnershipRequestDto, GroupIdRequestDto, BanishmentRequestDto } from "../../dtos/group.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

const groupController = new GroupController();

router.post(
	"/create",
	validateDto(CreateGroupDto),
	groupController.createGroup,
);

router.post(
	"/join",
	validateDto(GroupIdRequestDto),
	groupController.joinGroup,
);

router.post(
	"/getPendingJoinRequests",
	validateDto(GroupIdRequestDto),
	groupController.getPendingJoinRequests,
);

router.post(
	"/updateJoinRequest",
	validateDto(UpdateJoinGroupRequestDto),
	groupController.updateJoinRequest,
);

router.post(
	"/leave",
	validateDto(GroupIdRequestDto),
	groupController.leaveGroup,
);

router.post(
	"/banishMember",
	validateDto(BanishmentRequestDto),
	groupController.banishMember,
);

router.post(
	"/delete",
	validateDto(GroupIdRequestDto),
	groupController.deleteGroup,
);

router.post(
	"/transferOwnership",
	validateDto(TransferOwnershipRequestDto),
	groupController.transferOwnership,
);

export default router;
