// Represents the GroupMembers table.
export class GroupMember {
	group_id!: number; // Foreign key to Groups
	user_id!: number; // Foreign key to Users
	is_owner!: boolean; // Default: false
	join_timestamp!: Date; // Default: GETDATE()
	leave_timestamp?: Date; // Nullable
}
