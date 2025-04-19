// Functions for generating and verifying JWT tokens.
import jwt from "jsonwebtoken";

export class JwtUtil {
	/**
	 * Generates a JWT token.
	 * @param payload - The payload to include in the token.
	 * @param secret - The secret key for signing the token.
	 * @param expiresIn - The expiration time for the token (e.g., "1h", "7d").
	 * @returns The generated JWT token.
	 */
	static generateToken(
		payload: Record<string, unknown>,
		secret: string,
		expiresIn = "1h",
	): string {
		return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
	}

	/**
	 * Verifies a JWT token.
	 * @param token - The JWT token to verify.
	 * @param secret - The secret key used to sign the token.
	 * @returns The decoded payload if the token is valid.
	 * @throws An error if the token is invalid or expired.
	 */
	static verifyToken(token: string, secret: string): object | string {
		return jwt.verify(token, secret);
	}

	/**
	 * Decodes a JWT token without verifying its signature.
	 * @param token - The JWT token to decode.
	 * @returns The decoded payload.
	 */
	static decodeToken(
		token: string,
	): null | { [key: string]: unknown } | string {
		return jwt.decode(token);
	}
}
