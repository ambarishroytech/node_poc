import { decryptAES128, encryptAES128 } from "../src/utils/crypto.util";

describe("crypto.util", () => {
	const originalEnv = process.env;
	beforeAll(() => {
		process.env = {
			...originalEnv,
			AES_SECRET_KEY: "00112233445566778899aabbccddeeff",
		};
		jest.resetModules(); // reloads the util with new env
	});
	afterAll(() => {
		process.env = originalEnv;
	});

	it("should encrypt and decrypt text correctly", () => {
		const text = "hello world";
		const encrypted = encryptAES128(text);
		expect(Buffer.isBuffer(encrypted)).toBe(true);
		const decrypted = decryptAES128(encrypted);
		expect(decrypted).toBe(text);
	});

	it("should throw error for invalid decryption", () => {
		expect(() => decryptAES128(Buffer.from("invalid"))).toThrow();
	});
});
