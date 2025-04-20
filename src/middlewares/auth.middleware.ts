// Contains middleware functions for handling requests and responses.
// Verifies JWT tokens for protected routes.

import type { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { type JwtPayload, VerifyToken } from "../utils/jwt.util";
import { SendErrorResponse } from "../utils/response.util";

// Extend the Request interface to include the user property
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

// Middleware to verify JWT tokens
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		// Get the token from the Authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			SendErrorResponse(res, "Access denied. No token provided.", 401);
			return;
		}

		const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

		// Verify the token using jwt.util
		const decoded: JwtPayload = VerifyToken(token);

		// Attach the decoded payload to the request object for further use
		req.user = decoded;

		logger.info("Token verified successfully");

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		SendErrorResponse(res, "Invalid or expired token.", 401);
		return;
	}
};
