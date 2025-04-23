// Handles group creation, deletion, and management.
import type { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import { SendErrorResponse, SendSuccessResponse } from "../utils/response.util";
import { CreateGroupDto, UpdateJoinGroupRequestDto, TransferOwnershipRequestDto, GroupIdRequestDto, BanishmentRequestDto } from "../dtos/group.dto";
import type { JwtPayload } from "jsonwebtoken";

const groupService = new GroupService();

export class GroupController {
	async createGroup(req: Request, res: Response): Promise<void> {
		try {
            const ownerId: number = (req.user as JwtPayload).user_id;
			const requestDto: CreateGroupDto = req.body;
			await groupService.createGroup(requestDto, ownerId);
			SendSuccessResponse(res, null, "Group created successfully.", 201);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred";
			SendErrorResponse(res, errorMessage, 400);
		}
	}

	async joinGroup(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
            const requestDto: GroupIdRequestDto = req.body;
            await groupService.joinGroup(requestDto, userId);
            SendSuccessResponse(res, null, "Join request processed successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async getPendingJoinRequests(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
			const requestDto: GroupIdRequestDto = req.body;
            
            // Validate if the user is the owner of the group before fetching pending requests
            await groupService.ValidateGroupOwner(requestDto.group_id, userId);

            const pendingRequests = await groupService.getPendingJoinRequests(requestDto);
            SendSuccessResponse(res, pendingRequests, "Pending join requests retrieved successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async updateJoinRequest(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
            const requestDto: UpdateJoinGroupRequestDto = req.body;

            // Validate if the user is the owner of the group before fetching pending requests
            await groupService.ValidateGroupOwner(requestDto.group_id, userId);

            await groupService.updateJoinRequest(requestDto);
            SendSuccessResponse(res, null, "Join request updated successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async leaveGroup(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
            const requestDto: GroupIdRequestDto = req.body;
            await groupService.leaveGroup(requestDto, userId);
            SendSuccessResponse(res, null, "Left group successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async banishMember(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
            const requestDto: BanishmentRequestDto = req.body;

            // Validate if the user is the owner of the group before fetching pending requests
            await groupService.ValidateGroupOwner(requestDto.group_id, userId);

            await groupService.banishMember(requestDto);
            SendSuccessResponse(res, null, "Member banished successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async deleteGroup(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = (req.user as JwtPayload).user_id;
            const requestDto: GroupIdRequestDto = req.body;

            // Validate if the user is the owner of the group before fetching pending requests
            await groupService.ValidateGroupOwner(requestDto.group_id, userId);

            await groupService.deleteGroup(requestDto);
            SendSuccessResponse(res, null, "Group deleted successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }

    async transferOwnership(req: Request, res: Response): Promise<void> {
        try {
            const ownerId: number = (req.user as JwtPayload).user_id;
            const requestDto: TransferOwnershipRequestDto = req.body;

            // Validate if the user is the owner of the group before fetching pending requests
            await groupService.ValidateGroupOwner(requestDto.group_id, ownerId);

            await groupService.transferOwnership(requestDto, ownerId);
            SendSuccessResponse(res, null, "Ownership transferred successfully.", 200);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            SendErrorResponse(res, errorMessage, 400);
        }
    }
}
