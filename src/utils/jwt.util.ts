import dotenv from "dotenv";
// Functions for generating and verifying JWT tokens.
import jwt from "jsonwebtoken";
import logger from "../config/logger";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Default secret if not provided
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"; // Default expiration time if not provided

/**
 * Interface for the JWT payload structure.
 */
export interface JwtPayload {
	user_id: number; // User ID
	email: string; // User email
}

/**
 * Generates a JWT token.
 * @param payload - The payload to include in the token.
 * @returns The generated JWT token.
 */
export function GenerateToken(payload: JwtPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	} as jwt.SignOptions);
}

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws An error if the token is invalid or expired.
 */
export function VerifyToken(token: string): JwtPayload {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

/**
 * Decodes a JWT token without verifying its signature.
 * @param token - The JWT token to decode.
 * @returns The decoded payload.
 */
export function DecodeToken(token: string): JwtPayload | null {
	return jwt.decode(token) as JwtPayload | null;
}
