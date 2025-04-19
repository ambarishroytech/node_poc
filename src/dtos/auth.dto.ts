// Data Transfer Objects (DTOs) for validating and transforming incoming request data.
// DTOs for authentication requests (e.g., login, registration).

// DTO for User Registration
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
	@IsString({ message: "email is required." })
	@IsEmail({}, { message: "Invalid email format." })
	@MinLength(5, { message: "email must be at least 5 characters long." })
	@MaxLength(100, { message: "Email must be at least 100 characters long." })
	email!: string;

	@IsString({ message: "Password is required." })
	@MinLength(6, { message: "Password must be at least 6 characters long." })
	@MaxLength(20, { message: "Password must be at least 20 characters long." })
	password!: string;
}

// DTO for User Login
export class LoginUserDto {
	@IsString({ message: "email is required." })
	@IsEmail({}, { message: "Invalid email format." })
	@MinLength(5, { message: "email must be at least 5 characters long." })
	@MaxLength(100, { message: "Email must be at least 100 characters long." })
	email!: string;

	@IsString({ message: "Password is required." })
	@MinLength(6, { message: "Password must be at least 6 characters long." })
	@MaxLength(20, { message: "Password must be at least 20 characters long." })
	password!: string;
}

// DTO for Login Response
export class LoginResponseDto {
	token!: string;
}

// DTO for Logout Response
export class LogoutResponseDto {
	message!: string;
}
