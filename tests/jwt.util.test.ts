import { DecodeToken, GenerateToken, VerifyToken } from "../src/utils/jwt.util";
import type { JwtPayload } from "../src/utils/jwt.util";

describe("jwt.util", () => {
	const payload: JwtPayload = { user_id: 1, email: "test@example.com" };

	it("should generate and verify a token", () => {
		const token = GenerateToken(payload);
		expect(typeof token).toBe("string");
		const decoded = VerifyToken(token);
		expect(decoded.user_id).toBe(payload.user_id);
		expect(decoded.email).toBe(payload.email);
	});

	it("should decode a token", () => {
		const token = GenerateToken(payload);
		const decoded = DecodeToken(token);
		expect(decoded?.user_id).toBe(payload.user_id);
		expect(decoded?.email).toBe(payload.email);
	});

	it("should throw error for invalid token", () => {
		expect(() => VerifyToken("invalid.token")).toThrow();
	});
});
