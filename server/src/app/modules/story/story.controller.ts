import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../common/utils/response.utils";
import { Story } from "./story.model";

export const getStoriesController = async (req: Request, res: Response) => {
  try {
    const includeAll = req.query.includeAll === "true";
    const query = includeAll ? {} : { published: true };
    const stories = await Story.find(query).sort({ createdAt: -1 });

    return sendSuccess(res, stories, "Stories fetched successfully");
  } catch {
    return sendError(res, "Failed to fetch stories", 500);
  }
};

export const createStoryController = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id?: string } | undefined;
    if (!user?.id) {
      return sendError(res, "Unauthorized", 401);
    }

    const story = await Story.create({
      ...req.body,
      createdBy: user.id
    });

    return sendSuccess(res, story, "Story created successfully");
  } catch {
    return sendError(res, "Failed to create story", 500);
  }
};

export const updateStoryController = async (req: Request, res: Response) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true
    });

    if (!story) {
      return sendError(res, "Story not found", 404);
    }

    return sendSuccess(res, story, "Story updated successfully");
  } catch {
    return sendError(res, "Failed to update story", 500);
  }
};

export const deleteStoryController = async (req: Request, res: Response) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return sendError(res, "Story not found", 404);
    }

    return sendSuccess(res, story, "Story deleted successfully");
  } catch {
    return sendError(res, "Failed to delete story", 500);
  }
};
