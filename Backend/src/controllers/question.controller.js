import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createQuestion = asyncHandler(async (req, res) => {
    const { title, content, answer, course, companies } = req.body;

    if (!content || !answer || !course || !companies) {
        throw new ApiError(400, "Content, answer, course, and companies are required");
    }

    const question = await Question.create({
        title,
        content,
        answer,
        course,
        companies,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, question, "Question created successfully"));
});

const getQuestions = asyncHandler(async (_, res) => {
    const questions = await Question.find();
    return res
        .status(200)
        .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});

const getQuestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question fetched successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, answer, course, companies } = req.body;

    if (!content && !answer && !course && !companies) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const question = await Question.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(content && { content }),
                ...(answer && { answer }),
                ...(course && { course }),
                ...(companies && { companies }),
            },
        },
        { new: true }
    );

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question updated successfully"));
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question deleted successfully"));
});

export { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion };