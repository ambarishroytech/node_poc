import logger from "../config/logger"; // Import logger
import {
	type RetrievedMessageRequestDto,
	type RetrievedMessageResponseDto,
	type SendMessageDto,
	SendMessageResponseDto,
} from "../dtos/message.dto";
import type { Message } from "../entities/Message"; // Assuming Message entity exists for typing
import { io } from "../server";
import { decryptAES128, encryptAES128 } from "../utils/crypto.util";
import { DbUtils } from "../utils/db.utils"; // Import DbUtils

const dbUtils = new DbUtils(); // Instantiate DbUtils

// Handles sending and retrieving messages.
export class MessageService {
	async sendMessage(
		messageData: SendMessageDto,
		senderId: number,
	): Promise<SendMessageResponseDto> {
		try {
			const encryptedContentBuffer = encryptAES128(messageData.content);
			await dbUtils.executeStoredProcedure<void>("SP_SendMessage", {
				GroupId: messageData.group_id,
				SenderId: senderId, // Use senderId from auth context
				ContentEncrypted: encryptedContentBuffer,
			});

			logger.info(
				`Message sent by user ${senderId} to group ${messageData.group_id}`,
			);

			const response = new SendMessageResponseDto();
			response.message = "Message sent successfully.";
			response.AckData = {
				group_id: messageData.group_id.toString(),
				content: messageData.content,
				timestamp: new Date().toISOString(), // Use current timestamp
				delivered: true, // Assuming the message is delivered immediately
			};

			// Emit to all clients in the group
			io.to(`group_${messageData.group_id}`).emit(
				"newMessage",
				response.AckData,
			);

			return response;
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "Invalid Group or Sender.",
			});
			throw error;
		}
	}

	async retrieveMessages(
		retrieveRequest: RetrievedMessageRequestDto,
	): Promise<RetrievedMessageResponseDto[]> {
		try {
			// 1. Retrieve messages from the database
			const messagesResult = await dbUtils.executeStoredProcedure<Message[]>(
				"SP_RetrieveMessages",
				{
					GroupId: retrieveRequest.group_id,
					PageNumber: retrieveRequest.page_number,
					PageSize: retrieveRequest.page_size,
				},
			);

			// 2. Map database results to DTOs using the helper function
			const messages: RetrievedMessageResponseDto[] = messagesResult.map(
				this.mapMessageToDto,
			);

			// 3. Log the outcome
			logger.info(
				`Retrieved ${messages.length} messages for group ${retrieveRequest.group_id}`,
			);

			// 4. Return the DTOs
			return messages;
		} catch (error: unknown) {
			logger.error("Error in retrieveMessages service:", error);
			// Re-throw the error to be handled by the global error handler or controller
			throw error;
		}
	}

	// Helper function to map a single DB message to a DTO
	private mapMessageToDto(msg: Message): RetrievedMessageResponseDto {
		return {
			message_id: msg.message_id,
			sender_id: msg.sender_id,
			// Decrypt content - ensure decryptAES128 handles potential non-Buffer types if necessary, or keep the cast
			content: decryptAES128(msg.content_encrypted as Buffer),
			timestamp: msg.timestamp.toISOString(), // Format timestamp
		};
	}
}
