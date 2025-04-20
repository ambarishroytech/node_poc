// Provides a health check endpoint.
import type { Request, Response } from "express";
import { SendSuccessResponse } from "../utils/response.util";

export class HealthController {
	checkHealth(req: Request, res: Response): void {
		const healthCheck = {
			status: "ok",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		};
		SendSuccessResponse(res, healthCheck, "Health check successful.");
	}
}
