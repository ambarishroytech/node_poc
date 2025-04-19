// Configures the connection to the SQL Server database using mssql.

import dotenv from "dotenv";
import sql, { type ConnectionPool, type config as SqlConfig } from "mssql";
import logger from "./logger";

// Load environment variables from .env file
dotenv.config();

// Database configuration
const dbConfig: SqlConfig = {
	// user: process.env.DB_USERNAME || "",
	// password: process.env.DB_PASSWORD || "",
	server: process.env.DB_HOST || "",
	port: Number.parseInt(process.env.DB_PORT || "1433"),
	database: process.env.DB_NAME || "",
	options: {
		encrypt: true, // For secure connections
		trustServerCertificate: true, // Required for self-signed certificates
	},
	authentication: {
		type: "ntlm", // Use NTLM for Windows Authentication
		options: {
			domain: process.env.DB_DOMAIN || "", // Optional: Specify the domain if required
			userName: process.env.DB_USER || "", // Optional: Specify the Windows username if needed
			password: process.env.DB_PASSWORD || "", // Optional: Specify the password if needed
		},
	},
	pool: {
		max: 100, // Maximum number of connections in the pool
		min: 1, // Minimum number of connections in the pool
		idleTimeoutMillis: 30000, // Time (in ms) before an idle connection is closed
	},
};

// Create a connection pool
let pool: ConnectionPool | null = null;

export const getDbConnection = async (): Promise<ConnectionPool> => {
	if (!pool) {
		try {
			pool = await sql.connect(dbConfig);
			logger.info("Database connection established successfully.");
		} catch (error) {
			logger.error("Error during database connection initialization:", {
				error,
			});
			throw error;
		}
	}
	return pool;
};

export default getDbConnection;

// Example usage of the database connection in a repository file
////////////////////////////////////////////////////////////////////////////
// import getDbConnection from "../config/database";

// export const getUserByEmail = async (email: string): Promise<any> => {
//   const pool = await getDbConnection();
//   const result = await pool
//     .request()
//     .input("Email", email) // Pass parameters to the stored procedure
//     .execute("GetUserByEmail"); // Call the stored procedure
//   return result.recordset[0]; // Return the first record
// };
