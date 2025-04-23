// Data Transfer Objects (DTOs) for validating and transforming incoming request data.
// DTOs for group-related operations.
// DTO for Creating a Group
import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateGroupDto {
	@IsString({ message: "Group name is required." })
	@MinLength(3, { message: "Group name must be at least 3 characters long." })
	@MaxLength(100, {
		message: "Group name must be at least 100 characters long.",
	})
	group_name!: string;

	@IsInt({ message: "Ref Group Type ID must be an integer." })
	@Min(1, { message: "Ref Group Type ID must be greater than 0." })
	ref_group_type_id!: number;

	@IsInt({ message: "Max Member must be an integer." })
	@Min(2, { message: "Max Member must be greater than and equal to 2." })
	max_members!: number;
}

// DTO for Joining a Group
export class BanishmentRequestDto {
	@IsInt({ message: "User Id must be an integer." })
	@Min(1, { message: "User Id must be greater than 0." })
	user_id!: number;

	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number;

	@IsString({ message: "Comment is required." })
	comments!: string;
}

// DTO for Updating a Join Request
export class UpdateJoinGroupRequestDto {
	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number;
	
	@IsInt({ message: "Request ID must be an integer." })
	@Min(1, { message: "Request ID must be greater than 0." })
	request_id!: number; // ID of the join request to update

	@IsInt({ message: "Join Request Status ID must be an integer." })
	@Min(1, { message: "Join Request Status ID must be greater than 0." })
	ref_join_request_status_id!: number; // New status ID for the join request

	comments?: string;
}

export class TransferOwnershipRequestDto {
	@IsInt({ message: "New Owner Id must be an integer." })
	@Min(1, { message: "New Owner Id must be greater than 0." })
	new_owner_id!: number;

	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number;
}

export class GroupIdRequestDto {
	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number;
}


// DTO for Pending Join Requests
export class PendingJoinRequestResponseDto {
	request_id!: number;
	user_id!: number;
	request_timestamp!: string; // ISO 8601 format
}
