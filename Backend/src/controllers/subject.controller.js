import { Subject } from "../models/subject.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createSubject = asyncHandler(async (req, res) => {
    const { title, years } = req.body;

    if (!title || !years || !Array.isArray(years)) {
        throw new ApiError(400, "Title and years are required");
    }

    const subject = await Subject.create({
        title,
        years,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, subject, "Subject created successfully"));
});

const getSubjects = asyncHandler(async (_, res) => {
    const subjects = await Subject.find();
    return res
        .status(200)
        .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

const getSubjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject fetched successfully"));
});

const updateSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, years } = req.body;

    if (!title && !years && !Array.isArray(years)) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const subject = await Subject.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(years && { years }),
            },
        },
        { new: true }
    );

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject updated successfully"));
});

const deleteSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject deleted successfully"));
});

export { createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject };
