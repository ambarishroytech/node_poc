import { DbUtils } from "../src/utils/db.utils";

describe("DbUtils", () => {
	let dbUtils: DbUtils;

	beforeEach(() => {
		dbUtils = new DbUtils();
	});

	describe("handleDatabaseError", () => {
		it("throws mapped error message", () => {
			const error = { number: 123 };
			const errorMap = { 123: "Custom error" };
			expect(() => dbUtils.handleDatabaseError(error, errorMap)).toThrow(
				"Custom error",
			);
		});

		it("throws generic error if not mapped", () => {
			const error = { number: 999 };
			const errorMap = { 123: "Custom error" };
			expect(() => dbUtils.handleDatabaseError(error, errorMap)).toThrow(
				/An error occurred during the operation/,
			);
		});
	});

	describe("private extractErrorNumber", () => {
		it("extracts error number", () => {
			const error = { number: 42 };
			const extractErrorNumber = (
				dbUtils as unknown as {
					extractErrorNumber: (error: { number?: number }) =>
						| number
						| undefined;
				}
			).extractErrorNumber;
			expect(extractErrorNumber(error)).toBe(42);
		});
		it("returns undefined if no number", () => {
			const extractErrorNumber = (
				dbUtils as unknown as {
					extractErrorNumber: (error: { number?: number }) =>
						| number
						| undefined;
				}
			).extractErrorNumber;
			expect(extractErrorNumber({})).toBeUndefined();
		});
	});

	describe("private isMappedError", () => {
		it("returns true if error is mapped", () => {
			const isMappedError = (
				dbUtils as unknown as {
					isMappedError: (
						errorNumber: number,
						errorMap: Record<number, string>,
					) => boolean;
				}
			).isMappedError;
			expect(isMappedError(1, { 1: "err" })).toBe(true);
		});
		it("returns false if error is not mapped", () => {
			const isMappedError = (
				dbUtils as unknown as {
					isMappedError: (
						errorNumber: number,
						errorMap: Record<number, string>,
					) => boolean;
				}
			).isMappedError;
			expect(isMappedError(2, { 1: "err" })).toBe(false);
		});
	});
});
