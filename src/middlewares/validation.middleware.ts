// Contains middleware functions for handling requests and responses.
// Validates request bodies using DTOs.

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { SendErrorResponse } from "../utils/response.util";

// /**
//  * Middleware to validate request bodies against a DTO class.
//  * @param dtoClass The DTO class to validate against.
//  */

export function validateDto(dto: new () => object): RequestHandler {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			// Validation logic
			// Transform plain request body into an instance of the DTO class
			const dtoInstance = plainToInstance(dto, req.body);

			// Validate the DTO instance
			const errors = await validate(dtoInstance);

			if (errors.length > 0) {
				// Extract validation error messages
				const errorMessages = errors.map((error) =>
					Object.values(error.constraints || {}).join(", "),
				);

				SendErrorResponse(res, errorMessages.join("; "), 400);
				return;
			}
			next();
		} catch (error) {
			SendErrorResponse(res, "Internal server error during validation.", 500);
			return;
		}
	};
}
