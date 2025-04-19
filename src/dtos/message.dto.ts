// Data Transfer Objects (DTOs) for validating and transforming incoming request data.
// DTOs for message operations.

// DTO for sending a message
export class SendMessageDto {
	sender_id!: number; // ID of the sender
	content_encrypted!: string; // Encrypted message content (base64 encoded)
}

// DTO for the response of sending a message
export class SendMessageResponseDto {
	message_id!: number; // ID of the sent message
	message!: string; // Success message
}

// DTO for a single message in the retrieve messages response
export class RetrievedMessageDto {
	message_id!: number; // ID of the message
	sender_id!: number; // ID of the sender
	content_encrypted!: string; // Encrypted message content (base64 encoded)
	timestamp!: string; // Timestamp of when the message was sent (ISO 8601 format)
}

// DTO for the pagination metadata in the retrieve messages response
export class PaginationDto {
	current_page!: number; // Current page number
	total_pages!: number; // Total number of pages
	total_messages!: number; // Total number of messages
}

// DTO for the response of retrieving messages
export class RetrieveMessagesResponseDto {
	messages!: RetrievedMessageDto[]; // Array of retrieved messages
	pagination!: PaginationDto; // Pagination metadata
}
