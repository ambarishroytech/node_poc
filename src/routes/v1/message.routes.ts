// Routes for messages (e.g., /groups/{group_id}/messages).
import express from "express";
import { MessageController } from "../../controllers/message.controller";
import {
    SendMessageDto,
    RetrievedMessageRequestDto,
} from "../../dtos/message.dto";
import { validateDto } from "../../middlewares/validation.middleware";

const router = express.Router();
const messageController = new MessageController();

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Sending and retrieving group messages
 */

/**
 * @swagger
 * /api/v1/messages/send:
 *   post:
 *     summary: Send a message to a group
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageDto'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully.
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (invalid token)
 *       403:
 *         description: Forbidden (user is not a member of the group)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/send",
    validateDto(SendMessageDto),
    messageController.sendMessage,
);

/**
 * @swagger
 * /api/v1/messages/get:
 *   post:
 *     summary: Retrieve messages from a group (paginated)
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RetrievedMessageRequestDto'
 *     responses:
 *       200:
 *         description: List of messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RetrievedMessageResponseDto'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (invalid token)
 *       403:
 *         description: Forbidden (user is not a member of the group)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/get",
    validateDto(RetrievedMessageRequestDto),
    messageController.retrieveMessages,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     SendMessageDto:
 *       type: object
 *       required:
 *         - group_id
 *         - content
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The ID of the group to send the message to
 *           example: 12
 *         content:
 *           type: string
 *           description: The content of the message
 *           example: "Hello everyone!"
 *     RetrievedMessageRequestDto:
 *       type: object
 *       required:
 *         - group_id
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The ID of the group to retrieve messages from
 *           example: 12
 *         page_number:
 *           type: integer
 *           description: Page number for pagination (optional, defaults to 1)
 *           example: 1
 *         page_size:
 *           type: integer
 *           description: Number of messages per page (optional, defaults to 20)
 *           example: 20
 *     RetrievedMessageResponseDto:
 *       type: object
 *       properties:
 *         message_id:
 *           type: integer
 *           example: 101
 *         sender_id:
 *           type: integer
 *           example: 5
 *         content:
 *           type: string
 *           description: Decrypted message content
 *           example: "Hello everyone!"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2025-04-23T14:30:00Z
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;