// Handles group creation, deletion, and management.
import type { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import { SendErrorResponse, SendSuccessResponse } from "../utils/response.util";

const groupService = new GroupService();

export class GroupController {
	async createGroup(req: Request, res: Response): Promise<void> {
		try {
			const group = await groupService.createGroup(req.body);
			SendSuccessResponse(res, group, "Group created successfully.", 201);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred";
			SendErrorResponse(res, errorMessage, 400);
		}
	}
}
