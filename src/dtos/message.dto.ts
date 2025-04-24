// Data Transfer Objects (DTOs) for validating and transforming incoming request data.
// DTOs for message operations.

// DTO for sending a message
import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
export class SendMessageDto {
	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number; // ID of the Group

	@IsString({ message: "Message content is required." })
	@MinLength(1, { message: "Message content cannot be empty." })
	content!: string; // Changed from content_encrypted to content (plain text)
}

// DTO for the response of sending a message
export class SendMessageResponseDto {
	message!: string; // Success message
	AckData!: MessageAckDataDto;
}

export class MessageAckDataDto {
	group_id!: string;
	content!: string;
	timestamp!: string;
	delivered!: boolean;
}

export class RetrievedMessageRequestDto {
	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number; // ID of the Group

	@IsInt({ message: "Page number must be an integer." })
	@Min(1, { message: "Page number must be greater than 0." })
	page_number!: number;

	@IsInt({ message: "Page size must be an integer." })
	@Min(1, { message: "Page size must be greater than 0." })
	page_size!: number;
}

// DTO for a single message in the retrieve messages response
export class RetrievedMessageResponseDto {
	message_id!: number; // ID of the message
	sender_id!: number; // ID of the sender
	content!: string; // Changed from content_encrypted to content (plain text)
	timestamp!: string; // Timestamp of when the message was sent (ISO 8601 format)
}
