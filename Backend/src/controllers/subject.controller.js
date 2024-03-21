import { Subject } from "../models/subject.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Degree } from "../models/degree.model.js";

const createSubject = asyncHandler(async (req, res) => {
    const { title, years, degreeId, degreeTitle } = req.body;

    const yearsArray = years
        .split(" ")
        .map((value) => Number(value))
        .sort();

    if (!title || !years || !Array.isArray(yearsArray)) {
        throw new ApiError(400, "Title and years are required");
    }

    if (!degreeId && !degreeTitle) {
        throw new ApiError(400, "Degree id or title is required");
    }

    const degree = await Degree.findOne({
        $or: [{ _id: degreeId }, { title: degreeTitle }],
    });

    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    const subject = await Subject.create({
        title,
        years: yearsArray,
    });

    if (!subject) {
        throw new ApiError(500, "Something went wrong while creating subject");
    }

    degree.subjects.push(subject._id);
    try {
        await degree.save();
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while saving degree" + error.message,
        );
    }

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

    const yearsArray = years
        .split(" ")
        .map((value) => Number(value))
        .sort();

    if (!title && !(years && Array.isArray(yearsArray))) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const subject = await Subject.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(yearsArray.length && { years: yearsArray }),
            },
        },
        { new: true },
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
    const { degreeId, degreeTitle } = req.body;

    if (!degreeId && !degreeTitle) {
        throw new ApiError(400, "Degree id or title is required");
    }

    const degree = await Degree.findOne({
        $or: [{ _id: degreeId }, { title: degreeTitle }],
    });

    if (!degree) {
        throw new ApiError(404, "Degree not found");
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    degree.subjects = degree.subjects.filter((s) => s._id.toString() != id);

    try {
        await degree.save();
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while saving degree" + error.message,
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subject, "Subject deleted successfully"));
});

export {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
