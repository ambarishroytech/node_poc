import logger from "../config/logger"; // Import logger
import type {
	BanishmentRequestDto,
	CreateGroupDto,
	GroupIdRequestDto,
	PendingJoinRequestResponseDto,
	TransferOwnershipRequestDto,
	UpdateJoinGroupRequestDto,
} from "../dtos/group.dto";
import type { Group } from "../entities/Group";
import { DbUtils } from "../utils/db.utils"; // Import DbUtils

const dbUtils = new DbUtils(); // Instantiate DbUtils

// Handles group creation, deletion, and management.
export class GroupService {
	async createGroup(groupData: CreateGroupDto, ownerId: number): Promise<void> {
		try {
			// Call the stored procedure to create the group and add the owner as a member
			await dbUtils.executeStoredProcedure<void>("SP_CreateGroup", {
				GroupName: groupData.group_name,
				RefGroupTypeId: groupData.ref_group_type_id,
				OwnerId: ownerId,
				MaxMembers: groupData.max_members,
			});

			logger.info(
				`Group '${groupData.group_name}' created successfully by user ${ownerId}.`,
			);

			logger.info("Group created successfully.");
		} catch (error: unknown) {
			logger.error("Error in createGroup service:", error);
			throw error;
		}
	}

	async ValidateGroupOwner(groupId: number, userId: number): Promise<void> {
		try {
			// Call the stored procedure to create the group and add the owner as a member
			const groups = await dbUtils.executeStoredProcedure<Group[]>(
				"SP_GetGroup",
				{
					GroupId: groupId,
				},
			);

			logger.info(`Group id='${groupId}' found.`);
			const groupOwnerId = groups[0].owner_id;

			if (groupOwnerId !== userId) {
				logger.error(`User ${userId} is not the owner of group ${groupId}.`);
				throw new Error("User is not the owner of the group.");
			}
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "Invalid Group Id.",
			});
			throw error;
		}
	}

	async joinGroup(request: GroupIdRequestDto, userId: number): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_JoinGroup", {
				GroupId: request.group_id,
				UserId: userId,
			});

			logger.info(
				`User ${userId} requested to join group ${request.group_id}.`,
			);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "The group has already reached its maximum number of members.",
				50002:
					"User must wait 48 hours before requesting to join the group again.",
				50003: "A join request for this group and user already exists.",
				50004: "User is already a member of this group.",
			});
			throw error;
		}
	}

	async getPendingJoinRequests(
		request: GroupIdRequestDto,
	): Promise<PendingJoinRequestResponseDto[]> {
		try {
			const result = await dbUtils.executeStoredProcedure<
				PendingJoinRequestResponseDto[]
			>("SP_GetPendingJoinRequests", {
				GroupId: request.group_id,
			});

			return result;
		} catch (error: unknown) {
			logger.error("Error in getPendingJoinRequests service:", error);
			throw error;
		}
	}

	async updateJoinRequest(request: UpdateJoinGroupRequestDto): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_UpdateJoinRequest", {
				GroupId: request.group_id,
				RequestId: request.request_id,
				RefJoinRequestStatusId: request.ref_join_request_status_id,
				Comments: request.comments,
			});

			logger.info(
				`Join request ${request.request_id} updated to status ${request.ref_join_request_status_id}.`,
			);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50003: "Join request not found.",
				50004: "Join request status has already been changed.",
				50006: "Invalid join request status ID.",
			});
			throw error;
		}
	}

	async leaveGroup(request: GroupIdRequestDto, userId: number): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_LeaveGroup", {
				GroupId: request.group_id,
				UserId: userId,
			});

			logger.info(`User ${userId} left group ${request.group_id}.`);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "User is not a member of this group.",
			});
			throw error;
		}
	}

	async banishMember(request: BanishmentRequestDto): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_BanishMember", {
				GroupId: request.group_id,
				UserId: request.user_id,
				Comments: request.comments,
			});

			logger.info(
				`User ${request.user_id} was banished from group ${request.group_id}.`,
			);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50001: "User is not a member of this group.",
			});
			throw error;
		}
	}

	async deleteGroup(request: GroupIdRequestDto): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_DeleteGroup", {
				GroupId: request.group_id,
			});

			logger.info(`Group ${request.group_id} was deleted.`);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50005: "Cannot delete group with other members.",
			});
			throw error;
		}
	}

	async transferOwnership(
		request: TransferOwnershipRequestDto,
		ownerId: number,
	): Promise<void> {
		try {
			await dbUtils.executeStoredProcedure<void>("SP_TransferOwnership", {
				GroupId: request.group_id,
				OwnerId: ownerId,
				NewOwnerId: request.new_owner_id,
			});

			logger.info(
				`Ownership of group ${request.group_id} transferred from user ${ownerId} to user ${request.new_owner_id}.`,
			);
		} catch (error: unknown) {
			dbUtils.handleDatabaseError(error, {
				50004: "New owner must be a member of the group.",
			});
			throw error;
		}
	}
}
