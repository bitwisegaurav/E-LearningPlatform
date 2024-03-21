import { Degree } from "../models/degree.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Subject } from "../models/subject.model.js";
import { QuestionPaper } from "../models/questionPaper.model.js";
import { SolutionPaper } from "../models/solutionPaper.model.js";

const createDegree = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const degree = await Degree.create({
        title,
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

    const degree = await Degree.findById(id).populate("subjects");
    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, degree, "Degree fetched successfully"));
});

const updateDegree = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const degree = await Degree.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
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

    // Delete all the subjects associated with this degree
    try {
        await Subject.deleteMany({ _id: { $in: degree.subjects } });
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting subjects" + error.message);
    }

    // Delete all the question papers associated with this degree
    try {
        await QuestionPaper.deleteMany({ degree: { $in: degree.questionPapers } });
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting question papers" + error.message);
    }

    // Delete all the solution papers associated with this degree
    try {
        await SolutionPaper.deleteMany({ degree: { $in: degree.solutionPapers } });
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting solution papers" + error.message);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, degree, "Degree deleted successfully"));
});

export { createDegree, getDegrees, getDegreeById, updateDegree, deleteDegree };