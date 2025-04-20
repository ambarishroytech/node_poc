// Route for health check (e.g., /health).
import express, { type Request, type Response } from "express";
import {
	SendErrorResponse,
	SendSuccessResponse,
} from "../../utils/response.util";

const router = express.Router();

/**
 * Health Check Endpoint
 * @route GET /api/v1/health
 * @returns { status: "ok", uptime: <uptime_in_seconds>, timestamp: <current_timestamp> }
 */
router.get("/", (req: Request, res: Response) => {
	const healthCheck = {
		status: "ok",
		uptime: process.uptime(), // Server uptime in seconds
		timestamp: new Date().toISOString(), // Current timestamp
	};

	SendSuccessResponse(res, healthCheck, "Health checked successfully.", 200);
});

export default router;
