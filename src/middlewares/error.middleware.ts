// Contains middleware functions for handling requests and responses.
// Handles errors and sends standardized error responses.

import type { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { SendErrorResponse } from "../utils/response.util";

// Custom error interface
interface CustomError extends Error {
	status?: number;
}

// Error-handling middleware
// Error-handling middleware
export const errorMiddleware = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// Log the error
	logger.error(`Error: ${err.message}`, { stack: err.stack });

	// Set default status code and message
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";

	// Use SendErrorResponse to send the error response
	SendErrorResponse(res, message, status);
};
