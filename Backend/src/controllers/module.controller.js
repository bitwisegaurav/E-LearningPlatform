import { Module } from "../models/module.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Course } from "../models/course.model.js";
import mongoose from "mongoose";

const createModule = asyncHandler(async (req, res) => {
    const { title, content, courseTitle } = req.body;

    if (
        [title, content, courseTitle].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "Title, content, and assignments are required");
    }

    const existedModule = await Module.findOne({ title });

    if (existedModule) {
        throw new ApiError(409, "Module with this title already exists");
    }
    
    const course = await Course.findOne({ title: courseTitle });

    if(!course) {
        throw new ApiError(404, "Course not found");
    }

    const module = await Module.create({
        title,
        content,
    });

    course.modules.push(module._id);
    await course.save();

    return res
        .status(201)
        .json(new ApiResponse(201, module, "Module created successfully"));
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
    if(!req?.user || !req.user?.isAdmin) {
        throw new ApiError(403, "Unauthorized access");
    }

    const { id } = req.params;

    if(!id) {
        throw new ApiError(400, "Missing ID in request")
    }

    const { title, content } = req.body;

    if (
        [title, content].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const module = await Module.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(content && { content }),
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

    if(!id) {
        throw new ApiError(400, 'Missing Id in request')
    }

    const { courseTitle } = req.body;

    const course = await Course.findOne({ title: courseTitle });

    if(!course) {
        throw new ApiError(500, "Server error while finding the related course");
    }
    
    const module = await Module.findByIdAndDelete(id);
    if (!module) {
        throw new ApiError(404, "Module not found");
    }
    
    // remove module id from course modules array
    course.modules = course.modules.filter(itemId => itemId.toString() !== id);
    await course.save();
    
    return res
        .status(200)
        .json(new ApiResponse(200, "Module deleted successfully"));
});

export { createModule, getModuleById, updateModule, deleteModule };