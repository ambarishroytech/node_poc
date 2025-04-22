// src/utils/crypto.util.ts
import crypto from "crypto";
import dotenv from "dotenv";
import logger from "../config/logger";

dotenv.config();

const ALGORITHM = "aes-128-cbc";
// Ensure the key is exactly 16 bytes (128 bits) for AES-128
const SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY || "", "hex"); // Expecting a 32-char hex string in .env
const IV_LENGTH = 16; // For AES, this is always 16

if (SECRET_KEY.length !== 16) {
	logger.error(
		"Invalid AES_SECRET_KEY length. Must be a 32-character hex string (16 bytes).",
	);
	// Potentially throw an error or exit, depending on desired behavior
	throw new Error("Invalid AES_SECRET_KEY length.");
}

export const encryptAES128 = (text: string): Buffer => {
	try {
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
		let encrypted = cipher.update(text, "utf8");
		encrypted = Buffer.concat([encrypted, cipher.final()]);

		// Prepend IV to the encrypted data for storage/transmission
		return Buffer.concat([iv, encrypted]);
	} catch (error) {
		logger.error("Encryption failed:", error);
		throw new Error("Failed to encrypt message content.");
	}
};

export const decryptAES128 = (encryptedData: Buffer): string => {
	try {
		// Extract IV from the beginning of the buffer
		const iv = encryptedData.subarray(0, IV_LENGTH);
		const encryptedText = encryptedData.subarray(IV_LENGTH);

		const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString("utf8");
	} catch (error) {
		logger.error("Decryption failed:", error);
		throw new Error("Failed to decrypt message content.");
	}
};
