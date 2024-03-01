import { InterviewQuestion } from "../models/interviewQuestion.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createInterviewQuestion = asyncHandler(async (req, res) => {
    const { content, answer, course, companies } = req.body;

    if (!content || !answer || !course || !companies) {
        throw new ApiError(400, "Content, answer, course, and companies are required");
    }

    const interviewQuestion = await InterviewQuestion.create({
        content,
        answer,
        course,
        companies,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, interviewQuestion, "Interview question created successfully"));
});

const getInterviewQuestions = asyncHandler(async (_, res) => {
    const interviewQuestions = await InterviewQuestion.find();
    return res
        .status(200)
        .json(new ApiResponse(200, interviewQuestions, "Interview questions fetched successfully"));
});

const getInterviewQuestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interviewQuestion = await InterviewQuestion.findById(id);
    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, interviewQuestion, "Interview question fetched successfully"));
});

const updateInterviewQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, answer, course, companies } = req.body;

    if (!content && !answer && !course && !companies) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const interviewQuestion = await InterviewQuestion.findByIdAndUpdate(
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

    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, interviewQuestion, "Interview question updated successfully"));
});

const deleteInterviewQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interviewQuestion = await InterviewQuestion.findByIdAndDelete(id);
    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, interviewQuestion, "Interview question deleted successfully"));
});

export { createInterviewQuestion, getInterviewQuestions, getInterviewQuestionById, updateInterviewQuestion, deleteInterviewQuestion };