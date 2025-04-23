// Jest test skeleton for MessageController
import { MessageController } from "../src/controllers/message.controller";
import { MessageService } from "../src/services/message.service";
import {
	SendErrorResponse,
	SendSuccessResponse,
} from "../src/utils/response.util";

jest.mock("../src/services/message.service");
jest.mock("../src/utils/response.util");

describe("MessageController", () => {
	let controller: MessageController;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let req: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let res: any;

	beforeEach(() => {
		controller = new MessageController();
		req = { body: {}, user: { user_id: 1 } };
		res = {};
	});

	it("should sendMessage", async () => {
		// TODO: implement test
	});
	it("should retrieveMessages", async () => {
		// TODO: implement test
	});
});
