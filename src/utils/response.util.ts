// Functions for sending standardized API responses.
import type { Response } from "express";
import logger from "../config/logger";

/**
 * Sends a success response.
 * @param res - Express response object.
 * @param data - Data to send in the response.
 * @param message - Optional success message.
 * @param statusCode - HTTP status code (default: 200).
 */
export function SendSuccessResponse<T>(
	res: Response,
	data: T,
	message = "Success",
	statusCode = 200,
): void {
	logger.info(message);
	res.status(statusCode).json({
		success: true,
		message,
		data,
	});
}

/**
 * Sends an error response.
 * @param res - Express response object.
 * @param message - Error message.
 * @param statusCode - HTTP status code (default: 500).
 * @param errors - Optional array of validation or other errors.
 */
export function SendErrorResponse(
	res: Response,
	message = "An error occurred",
	statusCode = 500,
	errors: unknown[] = [],
): void {
	logger.error(message);
	res.status(statusCode).json({
		success: false,
		message,
		errors,
	});
}
