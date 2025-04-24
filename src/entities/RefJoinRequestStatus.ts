// Represents the RefJoinRequestStatuses table.
export class RefJoinRequestStatus {
	ref_join_request_status_id!: number; // Primary key
	ref_join_request_status_name!: string; // Unique and not null
	is_default!: boolean; // Not null
}
