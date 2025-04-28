import { json, urlencoded } from "body-parser";
import compression from "compression";
import cors from "cors";
// Initializes the Express app, middleware, and routes.
import express, { type Application } from "express";
import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "./config/logger";
import { setupSwagger } from "./config/swagger"; // Import setupSwagger

import authRoutesV1 from "./routes/v1/auth.routes";
import groupRoutesV1 from "./routes/v1/group.routes";
import healthRoutesV1 from "./routes/v1/health.routes";
import messageRoutesV1 from "./routes/v1/message.routes";

import { verifyToken } from "./middlewares/auth.middleware"; // Import verifyToken middleware
import { errorMiddleware } from "./middlewares/error.middleware";
import { SendErrorResponse } from "./utils/response.util";

const app: Application = express();

/**
 * Enforce HTTPS in production.
 * Redirects HTTP requests to HTTPS.
 */
if (process.env.NODE_ENV === "production") {
	app.use((req: Request, res: Response, next: NextFunction) => {
		if (req.headers["x-forwarded-proto"] !== "https") {
			return res.redirect(301, `https://${req.headers.host}${req.url}`);
		}
		next();
	});
}

// CORS Configuration
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", // Use ALLOWED_ORIGINS from .env
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

/**
 * Rate Limiting Middleware
 * Limits each IP to 100 requests per 15 minutes.
 * Adjust windowMs and max as needed.
 */
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// Set up Swagger
setupSwagger(app);

// Custom HTTP request logging middleware using winston
app.use((req: Request, res: Response, next: NextFunction) => {
	logger.http(`${req.method} ${req.url}`);
	next();
});

// API v1 Routes
// Public Routes (No Authentication Required)
app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/health", healthRoutesV1);

// Protected Routes (Require Authentication)
app.use("/api/v1", verifyToken); // Apply verifyToken middleware globally for all protected v1 routes
app.use("/api/v1/group", groupRoutesV1);
app.use("/api/v1/message", messageRoutesV1);

// Catch unsupported API versions
app.use("/api/:version", (req: Request, res: Response, next: NextFunction) => {
	SendErrorResponse(res, "API version not supported", 404);
	next();
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
