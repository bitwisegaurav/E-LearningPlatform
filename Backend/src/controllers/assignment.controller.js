import { Assignment } from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Module } from "../models/module.model.js";

const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, moduleId } = req.body;

    if ([title, description, moduleId].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title, description, and moduleId are required");
    }

    const assignment = await Assignment.create({
        title,
        description,
        module: moduleId,
    });

    if (!assignment) {
        throw new ApiError(500, "Something went wrong while creating assignment");
    }

    const module = await Module.findById(moduleId);

    if (!module) {
        throw new ApiError(404, "Module not found");
    }

    module.assignments.push(assignment._id);
    try {
        await module.save();
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating module" + error.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, assignment, "Assignment created successfully"));
});

const getAssignments = asyncHandler(async (_, res) => {
    const assignments = await Assignment.find().populate("module", "title");

    if (!assignments) {
        throw new ApiError(500, "Something went wrong while fetching assignments");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignments, "Assignments fetched successfully"));
});

const getAssignmentById = asyncHandler(async (req, res) => {
    const id = req.params?.id || req.body?.id;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment fetched successfully"));
});

const updateAssignment = asyncHandler(async (req, res) => {
    const id = req.params?.id || req.body?.id;

    // Validate the request body
    if (!id) {
        throw new ApiError(400, "Assignment id is required");
    }

    const { title, description, moduleId } = req.body;

    if ([title, description, moduleId].every((field) => field?.trim() === "")) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const assignment = await Assignment.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                module: { ...(moduleId && { moduleId }) },
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
    const id = req.params?.id || req.body?.id;

    if(!id) {
        throw new ApiError(400, "Assignment id is required");
    }
    
    const module = await Module.findById(assignment.module);
    
    if(!module) {
        throw new ApiError(404, "Module not found");
    }

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    module.assignments = module.assignments.filter((assignmentId) => assignmentId.toString() !== id);
    
    try {
        await module.save();
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating module" + error.message);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, assignment, "Assignment deleted successfully"));
});

export { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment };