import logger from "../config/logger";
import type { LoginResponseDto } from "../dtos/auth.dto";
import type { User } from "../entities/User";
import { HashPassword, VerifyHashedPassword } from "../utils/bcrypt.util";
import { DbUtils } from "../utils/db.utils";
import { GenerateToken, type JwtPayload } from "../utils/jwt.util";

const dbUtils = new DbUtils();

export class AuthService {
	async registerUser(email: string, password: string): Promise<void> {
		try {
			const hashedPassword = await HashPassword(password);

			await dbUtils.executeStoredProcedure<void>("SP_RegisterUser", {
				Email: email,
				PasswordHash: hashedPassword,
			});
			logger.info(`User saved in database: ${email}`);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "Email address already exists.",
			});
			throw error;
		}
	}

	async loginUser(email: string, password: string): Promise<LoginResponseDto> {
		try {
			const users = await dbUtils.executeStoredProcedure<User[]>("SP_GetUserForLogin", {
				Email: email,
			});

			const isValidPassword = VerifyHashedPassword(
				password,
				users[0].password_hash,
			);
			if (!isValidPassword) {
				throw new Error("Invalid Credentials.");
			}

			const tokenPayload: JwtPayload = {
				user_id: users[0].user_id,
				email: users[0].email,
			};

			const token = GenerateToken(tokenPayload);
			logger.info(`User (${email}) logged in successfully.`);

			return { token };
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "User is not registered.",
			});
			throw error;
		}
	}

	async getUser(user_id: number): Promise<User> {
		try {
			const users = await dbUtils.executeStoredProcedure<User[]>("SP_GetUser", {
				UserId: user_id,
			});

			logger.info(`User (id: ${user_id}) found.`);

			return users[0];
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "Invalid User Id.",
			});
			throw error;
		}
	}
}
