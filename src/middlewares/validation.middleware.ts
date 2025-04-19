// Contains middleware functions for handling requests and responses.
// Validates request bodies using DTOs.

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";

/**
 * Middleware to validate request bodies against a DTO class.
 * @param dtoClass The DTO class to validate against.
 */
export const validateDto = (dtoClass: new () => object) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Transform plain request body into an instance of the DTO class
			const dtoInstance = plainToInstance(dtoClass, req.body);

			// Validate the DTO instance
			const errors = await validate(dtoInstance);

			if (errors.length > 0) {
				// Extract validation error messages
				const errorMessages = errors.map((error) =>
					Object.values(error.constraints || {}).join(", "),
				);

				return res.status(400).json({
					success: false,
					errors: errorMessages,
				});
			}

			// Proceed to the next middleware or route handler
			next();
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "Internal server error during validation.",
			});
		}
	};
};
