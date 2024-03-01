import { Content } from "../models/content.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createContent = asyncHandler(async (req, res) => {
    const { title, body, module } = req.body;

    if (!title || !body || !module) {
        throw new ApiError(400, "Title, body, and module are required");
    }

    const content = await Content.create({
        title,
        body,
        module,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, content, "Content created successfully"));
});

const getContents = asyncHandler(async (_, res) => {
    const contents = await Content.find();
    return res
        .status(200)
        .json(new ApiResponse(200, contents, "Contents fetched successfully"));
});

const getContentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, content, "Content fetched successfully"));
});

const updateContent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, body, module } = req.body;

    if (!title && !body && !module) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const content = await Content.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(body && { body }),
                ...(module && { module }),
            },
        },
        { new: true }
    );

    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, content, "Content updated successfully"));
});

const deleteContent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const content = await Content.findByIdAndDelete(id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, content, "Content deleted successfully"));
});

export { createContent, getContents, getContentById, updateContent, deleteContent };