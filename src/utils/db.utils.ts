import getDbConnection, { type DatabaseError } from "../config/database";
import logger from "../config/logger";

export class DbUtils {
	/**
	 * Generic method to execute a stored procedure.
	 * @param spName - The name of the stored procedure to execute.
	 * @param inputs - A key-value pair object where the key is the parameter name and the value is the parameter value.
	 * @returns The result of the stored procedure execution as a strongly typed recordset.
	 */
	public async executeStoredProcedure<T>(
		spName: string,
		inputs: Record<string, unknown>,
	): Promise<T> {
		const pool = await getDbConnection();
		const request = pool.request();

		// Add all input parameters to the request
		for (const [key, value] of Object.entries(inputs)) {
			request.input(key, value);
		}

		// Execute the stored procedure
		const result = await request.execute(spName);
		logger.info(`Stored procedure ${spName} executed successfully.`);

		// Return the result recordset
		if (result === undefined || result.recordset === undefined) {
			return [] as T;
		}
		return result.recordset as T;
	}

	/**
	 * Handles database errors by mapping error numbers to user-friendly messages.
	 * @param error - The error object thrown by the database.
	 * @param errorMap - A map of error numbers to user-friendly messages.
	 * @throws A user-friendly error message if the error number is mapped, otherwise a generic error.
	 */
	public handleDatabaseError(
		error: unknown,
		errorMap: Record<number, string>,
	): never {
		const errorNumber = this.extractErrorNumber(error);

		if (
			errorNumber !== undefined &&
			this.isMappedError(errorNumber, errorMap)
		) {
			throw new Error(errorMap[errorNumber]);
		}

		logger.error("Database error:", { error });
		throw new Error(`An error occurred during the operation. ${error}`);
	}

	// Private helper methods

	/**
	 * Extracts the error number from the error object.
	 * @param error - The error object.
	 * @returns The error number if it exists, otherwise undefined.
	 */
	private extractErrorNumber(error: unknown): number | undefined {
		return (error as DatabaseError)?.number;
	}

	/**
	 * Checks if the error number exists in the error map.
	 * @param errorNumber - The error number to check.
	 * @param errorMap - The map of error numbers to messages.
	 * @returns True if the error number exists in the map, otherwise false.
	 */
	private isMappedError(
		errorNumber: number,
		errorMap: Record<number, string>,
	): boolean {
		return errorMap[errorNumber] !== undefined;
	}
}
