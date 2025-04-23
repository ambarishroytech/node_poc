// Route for health check (e.g., /health).
import express from "express";
import { HealthController } from "../../controllers/health.controller";

const router = express.Router();
const healthController = new HealthController();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health check
 */

/**
 * @swagger
 * /api/v1/health/check:
 *   get:
 *     summary: Check the health of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-23T12:00:00.000Z
 *       500:
 *         description: API is unhealthy or internal server error
 */
router.get("/check", healthController.checkHealth);

export default router;
