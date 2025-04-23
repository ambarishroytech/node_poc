import * as mssql from "mssql";
import getDbConnection from "../src/config/database";

describe("database config", () => {
	it("should export getDbConnection", () => {
		expect(getDbConnection).toBeInstanceOf(Function);
	});

	it("should throw and log error if connection fails", async () => {
		jest.spyOn(mssql, "ConnectionPool").mockImplementation(() => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return { connect: jest.fn().mockRejectedValue(new Error("fail")) } as any;
		});
		await expect(getDbConnection()).rejects.toThrow("fail");
	});
});
