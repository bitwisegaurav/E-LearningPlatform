import { SolutionPaper } from "../models/solution-paper.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createSolutionPaper = asyncHandler(async (req, res) => {
    const { title, fileURL, degree, subject, year, description } = req.body;

    if (!title || !fileURL || !degree || !subject || !year) {
        throw new ApiError(400, "Title, fileURL, degree, subject, and year are required");
    }

    const solutionPaper = await SolutionPaper.create({
        title,
        fileURL,
        degree,
        subject,
        year,
        description,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, solutionPaper, "Solution Paper created successfully"));
});

const getSolutionPapers = asyncHandler(async (_, res) => {
    const solutionPapers = await SolutionPaper.find();
    return res
        .status(200)
        .json(new ApiResponse(200, solutionPapers, "Solution Papers fetched successfully"));
});

const getSolutionPaperById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const solutionPaper = await SolutionPaper.findById(id);
    if (!solutionPaper) {
        throw new ApiError(404, "Solution Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, solutionPaper, "Solution Paper fetched successfully"));
});

const updateSolutionPaper = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, fileURL, degree, subject, year, description } = req.body;

    if (!title && !fileURL && !degree && !subject && !year) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const solutionPaper = await SolutionPaper.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(fileURL && { fileURL }),
                ...(degree && { degree }),
                ...(subject && { subject }),
                ...(year && { year }),
                ...(description && { description }),
            },
        },
        { new: true }
    );

    if (!solutionPaper) {
        throw new ApiError(404, "Solution Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, solutionPaper, "Solution Paper updated successfully"));
});

const deleteSolutionPaper = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const solutionPaper = await SolutionPaper.findByIdAndDelete(id);
    if (!solutionPaper) {
        throw new ApiError(404, "Solution Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, solutionPaper, "Solution Paper deleted successfully"));
});

export { createSolutionPaper, getSolutionPapers, getSolutionPaperById, updateSolutionPaper, deleteSolutionPaper };