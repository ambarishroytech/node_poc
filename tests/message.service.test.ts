import { MessageService } from "../src/services/message.service";
jest.mock("../src/utils/db.utils");
jest.mock("../src/utils/crypto.util");
const mockDbUtils = require("../src/utils/db.utils").DbUtils;
const mockEncryptAES128 = require("../src/utils/crypto.util").encryptAES128;
const mockDecryptAES128 = require("../src/utils/crypto.util").decryptAES128;

describe("MessageService", () => {
	let messageService: MessageService;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let dbUtilsInstance: any;

	beforeEach(() => {
		dbUtilsInstance = {
			executeStoredProcedure: jest.fn(),
			handleDatabaseError: jest.fn(),
		};
		mockDbUtils.mockImplementation(() => dbUtilsInstance);
		messageService = new MessageService();
	});

	it("sendMessage should encrypt and call stored procedure", async () => {
		mockEncryptAES128.mockReturnValue(Buffer.from("encrypted"));
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		const dto = { group_id: 1, content: "hi" };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result = await messageService.sendMessage(dto as any, 2);
		expect(mockEncryptAES128).toHaveBeenCalledWith("hi");
		expect(dbUtilsInstance.executeStoredProcedure).toHaveBeenCalled();
		expect(result.message).toBe("Message sent successfully.");
	});

	it("retrieveMessages should map and decrypt messages", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([
			{
				message_id: 1,
				sender_id: 2,
				content_encrypted: Buffer.from("enc"),
				timestamp: new Date("2024-01-01T00:00:00Z"),
			},
		]);
		mockDecryptAES128.mockReturnValue("decrypted");
		const result = await messageService.retrieveMessages({
			group_id: 1,
			page_number: 1,
			page_size: 10,
		});
		expect(result[0].content).toBe("decrypted");
		expect(result[0].message_id).toBe(1);
	});
});
