// Contains middleware functions for handling requests and responses.
// Verifies JWT tokens for protected routes.

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

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
			logger.error("No token provided.");
			res
				.status(401)
				.json({ success: false, message: "Access denied. No token provided." });
			return;
		}

		const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

		// Verify the token
		const secretKey = process.env.JWT_SECRET || "default_secret"; // Use the secret key from .env
		jwt.verify(token, secretKey);

		// Attach the decoded token to the request object
		logger.info("Token verified successfully");

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		logger.error("Invalid token:", { error });
		res
			.status(401)
			.json({ success: false, message: "Access denied. Invalid token." });
		return;
	}
};
