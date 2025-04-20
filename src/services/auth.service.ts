import logger from "../config/logger";
import type { LoginResponseDto } from "../dtos/auth.dto";
import type { User } from "../entities/User";
import { HashPassword } from "../utils/bcrypt.util";
import { DbUtils } from "../utils/db.utils";
import { GenerateToken } from "../utils/jwt.util";

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
		}
	}

	async loginUser(email: string, password: string): Promise<LoginResponseDto> {
		try {
			const hashedPassword = await HashPassword(password);
			const user = await dbUtils.executeStoredProcedure<User>("SP_LoginUser", {
				Email: email,
				PasswordHash: hashedPassword,
			});

			const token = GenerateToken({ user_id: user.user_id, email: user.email });
			logger.info(`User (${email}) logged in successfully.`);

			return { token };
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "User is not registered.",
				50002: "Invalid credentials.",
			});
			throw error;
		}
	}
}
