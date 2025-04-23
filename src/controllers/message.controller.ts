// Handles sending and retrieving messages.
import type { Request, Response } from "express";
import type {
	RetrievedMessageRequestDto,
	RetrievedMessageResponseDto,
	SendMessageDto,
	SendMessageResponseDto,
} from "../dtos/message.dto";
import { MessageService } from "../services/message.service";
import { SendErrorResponse, SendSuccessResponse } from "../utils/response.util";
import type { JwtPayload } from "jsonwebtoken";

const messageService = new MessageService();

export class MessageController {
	async sendMessage(req: Request, res: Response): Promise<void> {
		try {
			const requestDto: SendMessageDto = req.body;
			const senderId: number = (req.user as JwtPayload).user_id;
			const message: SendMessageResponseDto = await messageService.sendMessage(
				requestDto, senderId
			);
			SendSuccessResponse(res, message, "Message sent successfully.", 201);
		} catch (error) {
			if (error instanceof Error) {
				SendErrorResponse(res, error.message, 500);
			} else {
				SendErrorResponse(res, "An unknown error occurred.", 500);
			}
		}
	}

	async retrieveMessages(req: Request, res: Response): Promise<void> {
		try {
			const requestDto: RetrievedMessageRequestDto = req.body;
			const messages: RetrievedMessageResponseDto[] =
				await messageService.retrieveMessages(requestDto);
			SendSuccessResponse(res, messages, "Messages retrieved successfully.");
		} catch (error) {
			if (error instanceof Error) {
				SendErrorResponse(res, error.message, 500);
			} else {
				SendErrorResponse(res, "An unknown error occurred.", 500);
			}
		}
	}
}
