import { Answer } from "../models/answer.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createAnswer = asyncHandler(async (req, res) => {
    const { content, question } = req.body;

    if (!content || !question) {
        throw new ApiError(400, "Content and question are required");
    }

    const answer = await Answer.create({
        content,
        question,
        // Other fields as needed
    });

    return res
        .status(201)
        .json(new ApiResponse(201, answer, "Answer created successfully"));
});

const getAnswers = asyncHandler(async (_, res) => {
    const answers = await Answer.find();
    return res
        .status(200)
        .json(new ApiResponse(200, answers, "Answers fetched successfully"));
});

const getAnswerById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const answer = await Answer.findById(id);
    if (!answer) {
        throw new ApiError(404, "Answer not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, answer, "Answer fetched successfully"));
});

const updateAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const answer = await Answer.findByIdAndUpdate(
        id,
        { $set: { content } },
        { new: true }
    );

    if (!answer) {
        throw new ApiError(404, "Answer not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, answer, "Answer updated successfully"));
});

const deleteAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const answer = await Answer.findByIdAndDelete(id);
    if (!answer) {
        throw new ApiError(404, "Answer not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, answer, "Answer deleted successfully"));
});

export { createAnswer, getAnswers, getAnswerById, updateAnswer, deleteAnswer };