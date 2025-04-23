import logger from "../src/config/logger";

describe("logger config", () => {
	it("should export logger with info, error, warn, debug, http", () => {
		expect(logger).toHaveProperty("info");
		expect(logger).toHaveProperty("error");
		expect(logger).toHaveProperty("warn");
		expect(logger).toHaveProperty("debug");
		expect(logger).toHaveProperty("http");
	});

	it("should log info without throwing", () => {
		expect(() => logger.info("test")).not.toThrow();
	});
});
