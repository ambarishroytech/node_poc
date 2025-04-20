import getDbConnection, { type DatabaseError } from "../config/database";
import logger from "../config/logger";
import { LoginResponseDto } from "../dtos/auth.dto";
import type { User } from "../entities/User";
import { HashPassword } from "../utils/bcrypt.util";
import { GenerateToken } from "../utils/jwt.util";

export class AuthService {
	async registerUser(email: string, password: string): Promise<void> {
		try {
			const hashedPassword = await HashPassword(password);

			// Get the database connection
			const pool = await getDbConnection();

			// Call the RegisterUser stored procedure
			await pool
				.request()
				.input("Email", email)
				.input("PasswordHash", hashedPassword)
				.execute("SP_RegisterUser");

			logger.info(`User saved in database: ${email}`);
		} catch (error: unknown) {
			if ((error as DatabaseError).number === 50001) {
				throw new Error("Email address already exists.");
			}

			// Log and re-throw other errors
			logger.error("Error during user registration:", { error });
			throw new Error("An error occurred during user registration.");
		}
	}

	async loginUser(email: string, password: string): Promise<LoginResponseDto> {
		try {
			const hashedPassword = await HashPassword(password);

			// Get the database connection
			const pool = await getDbConnection();

			// Call the RegisterUser stored procedure
			const result = await pool
				.request()
				.input("Email", email)
				.input("PasswordHash", hashedPassword)
				.execute("SP_LoginUser");

			// Check if the user exists in the result
			if (result.recordset.length === 0) {
				throw new Error("Invalid credentials.");
			}

			// Map the result to the User entity
			const user: User = result.recordset[0] as User;

			// Generate JWT token
			const loginResponse = new LoginResponseDto();
			loginResponse.token = GenerateToken({ user_id: user.user_id, email });
			logger.info(`Use (${email}) logged-in successfully.`);
			return loginResponse;
		} catch (error: unknown) {
			if ((error as DatabaseError).number === 50001) {
				throw new Error("User is not registered.");
			}

			if ((error as DatabaseError).number === 50002) {
				throw new Error("Invalid credentials.");
			}

			logger.error("Error during login:", { error });
			throw new Error("An error occurred during login.");
		}
	}
}
