import { HashPassword, VerifyHashedPassword } from "../src/utils/bcrypt.util";

describe("bcrypt.util", () => {
	it("should hash and compare password correctly", async () => {
		const password = "test1234";
		const hash = await HashPassword(password);
		expect(typeof hash).toBe("string");
		const isMatch = await VerifyHashedPassword(password, hash);
		expect(isMatch).toBe(true);
	});
});
