// Represents the Banishment table.
export class Banishment {
	banishment_id!: number; // Primary key
	group_id!: number; // Foreign key to Groups
	user_id!: number; // Foreign key to Users
	comments!: string; // mandatory field, not null
	banishment_timestamp!: Date; // Default: GETDATE()
}
