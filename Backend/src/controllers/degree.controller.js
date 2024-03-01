import { Degree } from "../models/degree.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createDegree = asyncHandler(async (req, res) => {
    const { title, subjects } = req.body;

    if (!title || !subjects || !Array.isArray(subjects)) {
        throw new ApiError(400, "Title and subjects are required");
    }

    const degree = await Degree.create({
        title,
        subjects,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, degree, "Degree created successfully"));
});

const getDegrees = asyncHandler(async (_, res) => {
    const degrees = await Degree.find();
    return res
        .status(200)
        .json(new ApiResponse(200, degrees, "Degrees fetched successfully"));
});

const getDegreeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const degree = await Degree.findById(id);
    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, degree, "Degree fetched successfully"));
});

const updateDegree = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, subjects } = req.body;

    if (!title && !subjects && !Array.isArray(subjects)) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const degree = await Degree.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(subjects && { subjects }),
            },
        },
        { new: true }
    );

    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, degree, "Degree updated successfully"));
});

const deleteDegree = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const degree = await Degree.findByIdAndDelete(id);
    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, degree, "Degree deleted successfully"));
});

export { createDegree, getDegrees, getDegreeById, updateDegree, deleteDegree };