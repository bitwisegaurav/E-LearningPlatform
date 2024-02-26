import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createCourse = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // validation for fields
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if course is already exists
    const existedCourse = await Course.findOne({ title });
    if (existedCourse) {
        throw new ApiError(409, "Course with this title already exists");
    }

    // check for image
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Please provide an image");
    }

    // upload image to cloudinary
    const image = await uploadImage(imageLocalPath);
    if (!image) {
        throw new ApiError(500, "Failed to upload image");
    }

    const course = await Course.create({
        title,
        description,
        image,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, course, "Course created successfully"));
});

const getCourses = asyncHandler(async (__, res) => {
    const courses = await Course.find();
    if (!courses) {
        throw new ApiError(404, "Courses not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // validation for fields
    if (!title && !description) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const course = await Course.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
            },
        },
        { new: true },
    );

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

export { createCourse, getCourses, getCourseById };
