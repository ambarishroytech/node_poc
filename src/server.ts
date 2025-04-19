import dotenv from "dotenv";
// Starts the server and listens for incoming requests.
import app from "./app";

import { getDbConnection } from "./config/database";
import logger from "./config/logger";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;
const WEB_SERVER = process.env.WEB_SERVER || "http://localhost";

const startServer = async () => {
	try {
		// Initialize the database connection pool
		await getDbConnection();
		logger.info("Database connection pool initialized.");

		// Start the server
		app.listen(PORT, () => {
			logger.info(`Server is running on ${WEB_SERVER}:${PORT}`);
		});
	} catch (error) {
		logger.error("Failed to start the server:", { error });
		process.exit(1); // Exit the process if the database connection fails
	}
};

// Start the server
startServer();
