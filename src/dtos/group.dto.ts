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

	@IsInt({ message: "Owner ID must be an integer." })
	@Min(1, { message: "Owner ID must be greater than 0." })
	owner_id!: number;

	@IsInt({ message: "Ref Group Type ID must be an integer." })
	@Min(1, { message: "Ref Group Type ID must be greater than 0." })
	ref_group_type_id!: number;

	@IsInt({ message: "Max Member must be an integer." })
	@Min(2, { message: "Max Member must be greater than and equal to 2." })
	max_members!: number;
}

// DTO for Group Creation Response
export class CreateGroupResponseDto {
	group_id!: number;
}

// DTO for Join Group Request
export class JoinGroupRequestDto {
	@IsInt({ message: "Group ID must be an integer." })
	@Min(1, { message: "Group ID must be greater than 0." })
	group_id!: number; // ID of the group to join

	@IsInt({ message: "User ID must be an integer." })
	@Min(1, { message: "User ID must be greater than 0." })
	user_id!: number; // ID of the user requesting to join
}

// DTO for Joining a Group
export class JoinGroupResponseDto {
	message!: string;
}

// DTO for Updating a Join Request
export class UpdateJoinGroupRequestDto {
	@IsInt({ message: "Request ID must be an integer." })
	@Min(1, { message: "Request ID must be greater than 0." })
	request_id!: number; // ID of the join request to update

	@IsInt({ message: "Join Request Status ID must be an integer." })
	@Min(1, { message: "Join Request Status ID must be greater than 0." })
	ref_join_request_status_id!: number; // New status ID for the join request
}

// DTO for Updating a Join Request Response
export class UpdateJoinGroupResponseDto {
	message!: string; // Response message (e.g., "Join request updated successfully.")
}

// DTO for Leaving a Group
export class LeaveGroupResponseDto {
	message!: string;
}

// DTO for Pending Join Requests
export class PendingJoinRequestDto {
	request_id!: number;
	user_id!: number;
	email!: string;
	request_timestamp!: string; // ISO 8601 format
}

export interface PendingJoinRequestsResponseDto {
	requests: PendingJoinRequestDto[];
}
