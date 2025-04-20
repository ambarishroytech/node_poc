// Route for health check (e.g., /health).
import express from "express";
import { HealthController } from "../../controllers/health.controller";

const router = express.Router();
const healthController = new HealthController();

router.get("/check", healthController.checkHealth);

export default router;
