// Represents the Users table.

export class User {
	user_id!: number; // Primary key
	email!: string; // Unique and not null
	password_hash!: string; // Not null
	registration_timestamp!: Date; // Default: GETDATE()
	is_active!: boolean; // Default: true
}
