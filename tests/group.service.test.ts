import { GroupService } from "../src/services/group.service";
jest.mock("../src/utils/db.utils");
const mockDbUtils = require("../src/utils/db.utils").DbUtils;

describe("GroupService", () => {
	let groupService: GroupService;
	let dbUtilsInstance: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		executeStoredProcedure: jest.Mock<any, any>;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		handleDatabaseError: jest.Mock<any, any>;
	};

	beforeEach(() => {
		dbUtilsInstance = {
			executeStoredProcedure: jest.fn(),
			handleDatabaseError: jest.fn(),
		};
		mockDbUtils.mockImplementation(() => dbUtilsInstance);
		groupService = new GroupService();
	});

	it("createGroup should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.createGroup(
				{ group_name: "g", ref_group_type_id: 1, max_members: 10 },
				2,
			),
		).resolves.toBeUndefined();
		expect(dbUtilsInstance.executeStoredProcedure).toHaveBeenCalled();
	});

	it("ValidateGroupOwner should throw if not owner", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([{ owner_id: 2 }]);
		await expect(groupService.ValidateGroupOwner(1, 1)).rejects.toThrow(
			"User is not the owner of the group.",
		);
	});

	it("joinGroup should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.joinGroup({ group_id: 1 }, 2),
		).resolves.toBeUndefined();
	});

	it("getPendingJoinRequests should return result", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue([
			{ request_id: 1 },
		]);
		const result = await groupService.getPendingJoinRequests({ group_id: 1 });
		expect(result[0].request_id).toBe(1);
	});

	it("updateJoinRequest should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.updateJoinRequest({
				group_id: 1,
				request_id: 2,
				ref_join_request_status_id: 3,
				comments: "ok",
			}),
		).resolves.toBeUndefined();
	});

	it("leaveGroup should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.leaveGroup({ group_id: 1 }, 2),
		).resolves.toBeUndefined();
	});

	it("banishMember should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.banishMember({ group_id: 1, user_id: 2, comments: "bye" }),
		).resolves.toBeUndefined();
	});

	it("deleteGroup should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.deleteGroup({ group_id: 1 }),
		).resolves.toBeUndefined();
	});

	it("transferOwnership should call stored procedure", async () => {
		dbUtilsInstance.executeStoredProcedure.mockResolvedValue(undefined);
		await expect(
			groupService.transferOwnership({ group_id: 1, new_owner_id: 2 }, 3),
		).resolves.toBeUndefined();
	});
});
