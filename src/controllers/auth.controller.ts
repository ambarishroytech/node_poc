// Handles user registration, login, and logout.
import type { Request, Response } from "express";
import type { LoginResponseDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import { SendErrorResponse, SendSuccessResponse } from "../utils/response.util";

const authService = new AuthService();

export class AuthController {
	async register(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;
			await authService.registerUser(email, password);
			SendSuccessResponse(res, null, "Registration successful.", 201);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			SendErrorResponse(res, errorMessage, 500);
		}
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;
			const loginResponse: LoginResponseDto = await authService.loginUser(
				email,
				password,
			);
			SendSuccessResponse(res, { loginResponse }, "Login successful.");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			SendErrorResponse(res, errorMessage, 401);
		}
	}
}
