// Functions for hashing and verifying passwords.
import bcrypt from "bcrypt";

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds (default: 10).
 * @returns The hashed password.
 */
export async function HashPassword(
	password: string,
	saltRounds = 10,
): Promise<string> {
	return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifies a plain text password against a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns True if the password matches, false otherwise.
 */
export async function VerifyHashedPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}
