import { InterviewQuestion } from "../models/inerviewQuestion.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createInterviewQuestion = asyncHandler(async (req, res) => {
    const { title, description, answer, course, companies, tags } = req.body;

    if (!title || !course || !description) {
        throw new ApiError(
            400,
            "Content, answer, course, and companies are required",
        );
    }

    const existingQuestion = await InterviewQuestion.findOne({
        $or: [{ title }],
    });

    if (existingQuestion) {
        throw new ApiError(409, "Interview question already exists");
    }

    let companiesArray = null,
        tagsArray = null,
        coursesArray = null;

    if (typeof companies === "string") {
        companiesArray = companies.split(",").map((company) => company.trim());
    } else {
        companiesArray = companies;
    }

    tagsArray =
        typeof tags === "string"
            ? tags.split(",").map((tag) => tag.trim())
            : tags;

    coursesArray =
        typeof course === "string"
            ? course.split(",").map((course) => course.trim())
            : course;

    let courses = [];

    if (coursesArray && coursesArray?.length > 0) {
        courses = await Course.find({ name: { $in: coursesArray } }).select(
            "_id",
        );

        if (courses.length !== coursesArray.length) {
            throw new ApiError(400, "One or more courses not found");
        }
    }

    const interviewQuestion = await InterviewQuestion.create({
        title,
        description,
        answer,
        course: courses,
        companies: companiesArray,
        tags: tagsArray,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                interviewQuestion,
                "Interview question created successfully",
            ),
        );
});

const getInterviewQuestions = asyncHandler(async (_, res) => {
    const interviewQuestions = await InterviewQuestion.find().select(
        "-__v -description -answer",
    );
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                interviewQuestions,
                "Interview questions fetched successfully",
            ),
        );
});

const getInterviewQuestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Provide an id");

    const interviewQuestion = await InterviewQuestion.findById(id);
    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                interviewQuestion,
                "Interview question fetched successfully",
            ),
        );
});

const updateInterviewQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, answer, course, companies, tags } = req.body;

    if (
        [title, description, answer, course, companies, tags].every(
            (field) => !field || field === "" || field?.length === 0,
        )
    ) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    let companiesArray = null,
        tagsArray = null,
        coursesArray = null;

    if (typeof companies === "string") {
        companiesArray = companies.split(",").map((company) => company.trim());
    } else {
        companiesArray = companies;
    }

    tagsArray =
        typeof tags === "string"
            ? tags.split(",").map((tag) => tag.trim())
            : tags;

    coursesArray =
        typeof course === "string"
            ? course.split(",").map((course) => course.trim())
            : course;

    let courses = [];

    if (coursesArray && coursesArray?.length > 0) {
        courses = await Course.find({ name: { $in: coursesArray } }).select(
            "_id",
        );

        if (courses.length !== coursesArray.length) {
            throw new ApiError(400, "One or more courses not found");
        }
    }

    const interviewQuestion = await InterviewQuestion.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(answer && { answer }),
                ...(courses && { course: courses }),
                ...(companiesArray && { companies: companiesArray }),
                ...(tagsArray && { tags: tagsArray }),
            },
        },
        { new: true },
    );

    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                interviewQuestion,
                "Interview question updated successfully",
            ),
        );
});

const deleteInterviewQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interviewQuestion = await InterviewQuestion.findByIdAndDelete(id);
    if (!interviewQuestion) {
        throw new ApiError(404, "Interview question not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                interviewQuestion,
                "Interview question deleted successfully",
            ),
        );
});

export {
    createInterviewQuestion,
    getInterviewQuestions,
    getInterviewQuestionById,
    updateInterviewQuestion,
    deleteInterviewQuestion,
};
