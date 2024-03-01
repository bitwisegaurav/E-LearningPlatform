import { Module } from "../models/module.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createModule = asyncHandler(async (req, res) => {
    const { title, content, assignments } = req.body;

    if (!title || !content || !assignments) {
        throw new ApiError(400, "Title, content, and assignments are required");
    }

    const module = await Module.create({
        title,
        content,
        assignments,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, module, "Module created successfully"));
});

const getModules = asyncHandler(async (_, res) => {
    const modules = await Module.find();
    return res
        .status(200)
        .json(new ApiResponse(200, modules, "Modules fetched successfully"));
});

const getModuleById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const module = await Module.findById(id);
    if (!module) {
        throw new ApiError(404, "Module not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, module, "Module fetched successfully"));
});

const updateModule = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, assignments } = req.body;

    if (!title && !content && !assignments) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const module = await Module.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(content && { content }),
                ...(assignments && { assignments }),
            },
        },
        { new: true }
    );

    if (!module) {
        throw new ApiError(404, "Module not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, module, "Module updated successfully"));
});

const deleteModule = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const module = await Module.findByIdAndDelete(id);
    if (!module) {
        throw new ApiError(404, "Module not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, module, "Module deleted successfully"));
});

export { createModule, getModules, getModuleById, updateModule, deleteModule };