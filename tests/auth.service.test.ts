import { AuthService } from "../src/services/auth.service";

jest.mock("../src/utils/db.utils");
jest.mock("../src/utils/bcrypt.util");
jest.mock("../src/utils/jwt.util");

const mockDbUtils = require("../src/utils/db.utils").DbUtils;
const mockHashPassword = require("../src/utils/bcrypt.util").HashPassword;
const mockVerifyHashedPassword =
	require("../src/utils/bcrypt.util").VerifyHashedPassword;
const mockGenerateToken = require("../src/utils/jwt.util").GenerateToken;

describe("AuthService", () => {
	let authService: AuthService;
	let dbUtilsInstance: {
		executeStoredProcedure: jest.Mock;
		handleDatabaseError: jest.Mock;
	};

	beforeEach(() => {
		dbUtilsInstance = {
			executeStoredProcedure: jest.fn(),
			handleDatabaseError: jest.fn(),
		};
		mockDbUtils.mockImplementation(() => dbUtilsInstance);
		authService = new AuthService();
	});

	it("registerUser should hash password and call stored procedure", async () => {
		mockHashPassword.mockResolvedValue("hashed");
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			authService.registerUser("a@b.com", "pw"),
		).resolves.toBeUndefined();
		expect(mockHashPassword).toHaveBeenCalledWith("pw");
		expect(dbUtilsInstance.executeStoredProcedure).toHaveBeenCalled();
	});

	it("loginUser should return token if credentials valid", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([
			{ user_id: 1, email: "a@b.com", password_hash: "hash" },
		]);
		mockVerifyHashedPassword.mockReturnValue(true);
		mockGenerateToken.mockReturnValue("token");
		const result = await authService.loginUser("a@b.com", "pw");
		expect(result.token).toBe("token");
	});

	it("loginUser should throw if password invalid", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([
			{ user_id: 1, email: "a@b.com", password_hash: "hash" },
		]);
		mockVerifyHashedPassword.mockReturnValue(false);
		await expect(authService.loginUser("a@b.com", "pw")).rejects.toThrow(
			"Invalid Credentials.",
		);
	});

	it("getUser should return user", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([
			{ user_id: 1, email: "a@b.com" },
		]);
		const user = await authService.getUser(1);
		expect(user.user_id).toBe(1);
	});
});
