import type { Application } from "express";
// Configures Swagger for API documentation.
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./logger"; // Import the logger

const PORT = process.env.PORT || 3000;
const WEB_SERVER = process.env.WEB_SERVER || "http://localhost";

// Swagger definition
const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Group Messaging API", // API title
		version: "1.0.0", // API version
		description: "API documentation for the Group Messaging System", // API description
	},
	servers: [
		{
			url: `${WEB_SERVER}:${PORT}`, // Use WEB_SERVER and PORT from .env
			description: "Development server",
		},
	],
};

// Swagger options
const swaggerOptions = {
	swaggerDefinition,
	apis: ["./src/routes/v1/*.ts"], // Path to the API route files
};

// Initialize Swagger documentation
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Function to set up Swagger in the app
export const setupSwagger = (app: Application): void => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	logger.info("Swagger documentation is available at /api-docs");
};
