import { QuestionPaper } from "../models/question-paper.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createQuestionPaper = asyncHandler(async (req, res) => {
    const { title, fileURL, degree, subject, year, description } = req.body;

    if (!title || !fileURL || !degree || !subject || !year) {
        throw new ApiError(400, "Title, fileURL, degree, subject, and year are required");
    }

    const questionPaper = await QuestionPaper.create({
        title,
        fileURL,
        degree,
        subject,
        year,
        description,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, questionPaper, "Question Paper created successfully"));
});

const getQuestionPapers = asyncHandler(async (_, res) => {
    const questionPapers = await QuestionPaper.find();
    return res
        .status(200)
        .json(new ApiResponse(200, questionPapers, "Question Papers fetched successfully"));
});

const getQuestionPaperById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const questionPaper = await QuestionPaper.findById(id);
    if (!questionPaper) {
        throw new ApiError(404, "Question Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, questionPaper, "Question Paper fetched successfully"));
});

const updateQuestionPaper = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, fileURL, degree, subject, year, description } = req.body;

    if (!title && !fileURL && !degree && !subject && !year) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const questionPaper = await QuestionPaper.findByIdAndUpdate(
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

    if (!questionPaper) {
        throw new ApiError(404, "Question Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, questionPaper, "Question Paper updated successfully"));
});

const deleteQuestionPaper = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const questionPaper = await QuestionPaper.findByIdAndDelete(id);
    if (!questionPaper) {
        throw new ApiError(404, "Question Paper not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, questionPaper, "Question Paper deleted successfully"));
});

export { createQuestionPaper, getQuestionPapers, getQuestionPaperById, updateQuestionPaper, deleteQuestionPaper };