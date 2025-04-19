// Represents the Messages table.
export class Message {
	message_id!: number; // Primary key
	group_id!: number; // Foreign key to Groups
	sender_id!: number; // Foreign key to Users
	content_encrypted!: Buffer; // Encrypted message content
	timestamp!: Date; // Default: GETDATE()
	last_updated!: Date; // Default: GETDATE()
}
