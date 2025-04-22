// Represents the Users table.

export class User {
	user_id!: number; // Primary key
	email!: string; // Unique and not null
	password_hash!: string; // not null
}
