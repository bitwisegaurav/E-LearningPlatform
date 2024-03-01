import { Assignment } from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, moduleId } = req.body;

    if (!title || !description || !moduleId) {
        throw new ApiError(400, "Title, description, and moduleId are required");
    }

    const assignment = await Assignment.create({
        title,
        description,
        moduleId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, assignment, "Assignment created successfully"));
});

const getAssignments = asyncHandler(async (_, res) => {
    const assignments = await Assignment.find();
    return res
        .status(200)
        .json(new ApiResponse(200, assignments, "Assignments fetched successfully"));
});

const getAssignmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment fetched successfully"));
});

const updateAssignment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, moduleId } = req.body;

    if (!title && !description && !moduleId) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const assignment = await Assignment.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(moduleId && { moduleId }),
            },
        },
        { new: true }
    );

    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment updated successfully"));
});

const deleteAssignment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment deleted successfully"));
});

export { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment };