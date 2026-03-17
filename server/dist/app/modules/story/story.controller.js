"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStoryController = exports.updateStoryController = exports.createStoryController = exports.getStoriesController = void 0;
const response_utils_1 = require("../../common/utils/response.utils");
const story_model_1 = require("./story.model");
const getStoriesController = async (req, res) => {
    try {
        const includeAll = req.query.includeAll === "true";
        const query = includeAll ? {} : { published: true };
        const stories = await story_model_1.Story.find(query).sort({ createdAt: -1 });
        return (0, response_utils_1.sendSuccess)(res, stories, "Stories fetched successfully");
    }
    catch {
        return (0, response_utils_1.sendError)(res, "Failed to fetch stories", 500);
    }
};
exports.getStoriesController = getStoriesController;
const createStoryController = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return (0, response_utils_1.sendError)(res, "Unauthorized", 401);
        }
        const story = await story_model_1.Story.create({
            ...req.body,
            createdBy: user.id
        });
        return (0, response_utils_1.sendSuccess)(res, story, "Story created successfully");
    }
    catch {
        return (0, response_utils_1.sendError)(res, "Failed to create story", 500);
    }
};
exports.createStoryController = createStoryController;
const updateStoryController = async (req, res) => {
    try {
        const story = await story_model_1.Story.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true
        });
        if (!story) {
            return (0, response_utils_1.sendError)(res, "Story not found", 404);
        }
        return (0, response_utils_1.sendSuccess)(res, story, "Story updated successfully");
    }
    catch {
        return (0, response_utils_1.sendError)(res, "Failed to update story", 500);
    }
};
exports.updateStoryController = updateStoryController;
const deleteStoryController = async (req, res) => {
    try {
        const story = await story_model_1.Story.findByIdAndDelete(req.params.id);
        if (!story) {
            return (0, response_utils_1.sendError)(res, "Story not found", 404);
        }
        return (0, response_utils_1.sendSuccess)(res, story, "Story deleted successfully");
    }
    catch {
        return (0, response_utils_1.sendError)(res, "Failed to delete story", 500);
    }
};
exports.deleteStoryController = deleteStoryController;
//# sourceMappingURL=story.controller.js.map