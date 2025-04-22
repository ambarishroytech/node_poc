// Configures the connection to the SQL Server database using mssql.

import dotenv from "dotenv";
import sql, { type ConnectionPool, type config as SqlConfig } from "mssql";
import logger from "./logger";

// Load environment variables from .env file
dotenv.config();

export interface DatabaseError extends Error {
	number?: number;
}

// Database configuration
const dbConfig: SqlConfig = {
	server: process.env.DB_HOST || "", // Should be just the server name, e.g., ASUS-ROG-STRIX
	//port: process.env.DB_PORT as Number || 1433,// Add the port number here
	database: process.env.DB_NAME || "",
	options: {
		encrypt: false, // Temporarily disable encryption for local dev troubleshooting
		trustServerCertificate: true, // Keep this true when encrypt is false or for self-signed certs
	},
	authentication: {
		type: "default", // Use default for SQL Server Authentication
		options: {
			userName: process.env.DB_USER || "", // Specify the database username
			password: process.env.DB_PASSWORD || "", // Specify the database password
		},
	},
	pool: {
		max: 10, // Maximum number of connections in the pool
		min: 1, // Minimum number of connections in the pool
		idleTimeoutMillis: 30000, // Time (in ms) before an idle connection is closed
	},
	connectionTimeout: 30000, // Increase connection timeout to 30 seconds
};

export const getDbConnection = async (): Promise<ConnectionPool> => {
	try {
		const pool = await new sql.ConnectionPool(dbConfig).connect();
		logger.info("Database connection established successfully.");
		return pool;
	} catch (error) {
		// Log the specific error details
		logger.error("Error during database connection initialization:", {
			message: error instanceof Error ? error.message : String(error),
			code: (error as any)?.code, // Attempt to get error code
			originalError: (error as any)?.originalError, // Log original error if available
			error, // Log the full error object
		});
		throw error;
	}
};

export default getDbConnection;
