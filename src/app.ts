import { json, urlencoded } from "body-parser";
import compression from "compression";
import cors from "cors";
// Initializes the Express app, middleware, and routes.
import express, { type Application } from "express";
import type { NextFunction, Request, Response } from "express";
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

// CORS Configuration
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", // Use ALLOWED_ORIGINS from .env
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

// Middleware
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
app.use("/api/v1/groups", groupRoutesV1);
app.use("/api/v1/groups/:groupId/requests", groupRoutesV1);
app.use("/api/v1/groups/:groupId/messages", messageRoutesV1);

// Catch unsupported API versions
app.use("/api/:version", (req: Request, res: Response, next: NextFunction) => {
	SendErrorResponse(res, "API version not supported", 404);
	next();
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
