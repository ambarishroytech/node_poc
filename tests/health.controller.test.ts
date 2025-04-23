import request from "supertest";
import app from "../src/app";
import { HealthController } from "../src/controllers/health.controller";
import { SendSuccessResponse } from "../src/utils/response.util";

jest.mock("../src/utils/response.util");

describe("Health Controller", () => {
	it("GET /api/v1/health should return status ok", async () => {
		const res = await request(app).get("/api/v1/health");
		expect(res.statusCode).toBe(200);
		expect(res.body.status).toBe("ok");
	});
});

describe("HealthController", () => {
	let controller: HealthController;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let req: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let res: any;

	beforeEach(() => {
		controller = new HealthController();
		req = {};
		res = {};
	});

	it("should return health check response", () => {
		// TODO: implement test
	});
});
