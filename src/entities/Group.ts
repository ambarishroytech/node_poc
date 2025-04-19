// Represents the Groups table.
export class Group {
	group_id!: number; // Primary key
	group_name!: string; // Not null
	ref_group_type_id!: number; // Foreign key to RefGroupTypes
	owner_id!: number; // Foreign key to Users
	max_members?: number; // Optional
	creation_timestamp!: Date; // Default: GETDATE()
	last_updated!: Date; // Default: GETDATE()
}
