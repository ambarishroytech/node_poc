import logger from "../config/logger"; // Import logger
import type { CreateGroupDto } from "../dtos/group.dto";
import { DbUtils } from "../utils/db.utils"; // Import DbUtils

const dbUtils = new DbUtils(); // Instantiate DbUtils

// Handles group creation, deletion, and management.
export class GroupService {
	async createGroup(groupData: CreateGroupDto): Promise<void> {
		try {
			// Call the stored procedure to create the group and add the owner as a member
			await dbUtils.executeStoredProcedure<void>("SP_CreateGroup", {
				GroupName: groupData.group_name,
				RefGroupTypeId: groupData.ref_group_type_id,
				OwnerId: groupData.owner_id, // Assuming owner_id is passed in DTO
				MaxMembers: groupData.max_members,
			});

			logger.info(
				`Group '${groupData.group_name}' created successfully by user ${groupData.owner_id}.`,
			);

			logger.info("Group created successfully.");
		} catch (error: unknown) {
			logger.error("Error in createGroup service:", error);
			// Re-throw the error to be handled by the global error handler or controller
			throw error;
		}
	}
}
