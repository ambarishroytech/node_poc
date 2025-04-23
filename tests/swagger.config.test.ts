import express from "express";
import { setupSwagger } from "../src/config/swagger";

describe("swagger config", () => {
	it("should add /api-docs route to the app", () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const app = { use: jest.fn() } as any;
		setupSwagger(app);
		expect(app.use).toHaveBeenCalledWith(
			"/api-docs",
			expect.any(Function),
			expect.any(Function),
		);
	});
});
