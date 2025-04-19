// Represents the JoinRequests table.
export class JoinRequest {
	request_id!: number; // Primary key
	group_id!: number; // Foreign key to Groups
	user_id!: number; // Foreign key to Users
	request_timestamp!: Date; // Default: GETDATE()
	ref_join_request_status_id!: number; // Foreign key to RefJoinRequestStatuses
}
