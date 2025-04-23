// Routes for group operations (e.g., /groups).
import express from "express";
import { GroupController } from "../../controllers/group.controller";
import {
	CreateGroupDto,
	UpdateJoinGroupRequestDto,
	TransferOwnershipRequestDto,
	GroupIdRequestDto,
	BanishmentRequestDto,
} from "../../dtos/group.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();

const groupController = new GroupController();

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group management and operations
 */

/**
 * @swagger
 * /api/v1/groups/create:
 *   post:
 *     summary: Create a new group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupDto'
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group created successfully.
 *                 group_id:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (invalid token)
 *       500:
 *         description: Internal server error
 */
router.post(
	"/create",
	validateDto(CreateGroupDto),
	groupController.createGroup,
);

/**
 * @swagger
 * /api/v1/groups/join:
 *   post:
 *     summary: Request to join an existing group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupIdRequestDto'
 *     responses:
 *       200:
 *         description: Join request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Join request submitted.
 *       400:
 *         description: Invalid input data or already a member/request pending/banned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/join",
	validateDto(GroupIdRequestDto),
	groupController.joinGroup,
);

/**
 * @swagger
 * /api/v1/groups/getPendingJoinRequests:
 *   post:
 *     summary: Get pending join requests for a group (owner only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupIdRequestDto'
 *     responses:
 *       200:
 *         description: List of pending join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   request_id:
 *                     type: integer
 *                     example: 5
 *                   user_id:
 *                     type: integer
 *                     example: 10
 *                   username:
 *                     type: string
 *                     example: requester_user
 *                   request_date:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-23T10:00:00Z
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not the owner)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/getPendingJoinRequests",
	validateDto(GroupIdRequestDto),
	groupController.getPendingJoinRequests,
);

/**
 * @swagger
 * /api/v1/groups/updateJoinRequest:
 *   post:
 *     summary: Accept or reject a pending join request (owner only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJoinGroupRequestDto'
 *     responses:
 *       200:
 *         description: Join request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Join request accepted/rejected.
 *       400:
 *         description: Invalid input data or request not found/already processed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not the owner)
 *       404:
 *         description: Group or Request not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/updateJoinRequest",
	validateDto(UpdateJoinGroupRequestDto),
	groupController.updateJoinRequest,
);

/**
 * @swagger
 * /api/v1/groups/leave:
 *   post:
 *     summary: Leave a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupIdRequestDto'
 *     responses:
 *       200:
 *         description: Successfully left the group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You have left the group.
 *       400:
 *         description: Invalid input data or not a member
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (owner cannot leave, must transfer ownership first)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/leave",
	validateDto(GroupIdRequestDto),
	groupController.leaveGroup,
);

/**
 * @swagger
 * /api/v1/groups/banishMember:
 *   post:
 *     summary: Banish a member from a group (owner only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BanishmentRequestDto'
 *     responses:
 *       200:
 *         description: Member banished successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member banished successfully.
 *       400:
 *         description: Invalid input data or user not a member/cannot banish owner
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not the owner)
 *       404:
 *         description: Group or User not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/banishMember",
	validateDto(BanishmentRequestDto),
	groupController.banishMember,
);

/**
 * @swagger
 * /api/v1/groups/delete:
 *   post:
 *     summary: Delete a group (owner only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupIdRequestDto'
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group deleted successfully.
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not the owner)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/delete",
	validateDto(GroupIdRequestDto),
	groupController.deleteGroup,
);

/**
 * @swagger
 * /api/v1/groups/transferOwnership:
 *   post:
 *     summary: Transfer ownership of a group to another member (owner only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferOwnershipRequestDto'
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ownership transferred successfully.
 *       400:
 *         description: Invalid input data or target user not a member/already owner
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user is not the owner)
 *       404:
 *         description: Group or Target User not found
 *       500:
 *         description: Internal server error
 */
router.post(
	"/transferOwnership",
	validateDto(TransferOwnershipRequestDto),
	groupController.transferOwnership,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateGroupDto:
 *       type: object
 *       required:
 *         - group_name
 *         - ref_group_type_id
 *         - max_members
 *       properties:
 *         group_name:
 *           type: string
 *           description: Name of the new group
 *           example: My Awesome Group
 *         ref_group_type_id:
 *           type: integer
 *           description: ID of the group type (e.g., 1 for public, 2 for private)
 *           example: 1
 *         max_members:
 *           type: integer
 *           description: Maximum number of members allowed
 *           example: 50
 *     GroupIdRequestDto:
 *       type: object
 *       required:
 *         - group_id
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The ID of the target group
 *           example: 12
 *     UpdateJoinGroupRequestDto:
 *       type: object
 *       required:
 *         - request_id
 *         - status_id
 *       properties:
 *         request_id:
 *           type: integer
 *           description: The ID of the join request to update
 *           example: 5
 *         status_id:
 *           type: integer
 *           description: The new status ID (e.g., 2 for Accepted, 3 for Rejected)
 *           example: 2
 *     BanishmentRequestDto:
 *       type: object
 *       required:
 *         - group_id
 *         - user_id
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The ID of the group
 *           example: 12
 *         user_id:
 *           type: integer
 *           description: The ID of the user to banish
 *           example: 25
 *     TransferOwnershipRequestDto:
 *       type: object
 *       required:
 *         - group_id
 *         - new_owner_id
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The ID of the group
 *           example: 12
 *         new_owner_id:
 *           type: integer
 *           description: The ID of the user to transfer ownership to
 *           example: 30
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
