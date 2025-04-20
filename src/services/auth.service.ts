// Handles user authentication and token generation.
import { HashPassword, VerifyHashedPassword } from "../utils/bcrypt.util";
import { GenerateToken } from "../utils/jwt.util";

export class AuthService {
	async registerUser(email: string, password: string): Promise<void> {
		const hashedPassword = await HashPassword(password);
		// Save the user to the database (mocked here)
		console.log(`User registered: ${email}, Password Hash: ${hashedPassword}`);
	}

	async loginUser(email: string, password: string): Promise<string> {
		// Mocked user lookup
		const user = { email, passwordHash: "mocked_hash" };

		// Verify password
		const isPasswordValid = await VerifyHashedPassword(
			password,
			user.passwordHash,
		);

		if (!isPasswordValid) {
			throw new Error("Invalid email or password.");
		}

		// Generate JWT token
		return GenerateToken({ user_id: 1, email });
	}
}
