// Handles sending and retrieving messages.
import type { Request, Response } from "express";
import type {
	RetrievedMessageResponseDto,
	SendMessageResponseDto,
} from "../dtos/message.dto";
import { MessageService } from "../services/message.service";
import { SendErrorResponse, SendSuccessResponse } from "../utils/response.util";

const messageService = new MessageService();

export class MessageController {
	async sendMessage(req: Request, res: Response): Promise<void> {
		try {
			const message: SendMessageResponseDto = await messageService.sendMessage(
				req.body,
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
			const messages: RetrievedMessageResponseDto[] =
				await messageService.retrieveMessages(req.body);
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
