import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Module } from "../models/module.model.js";

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
    const image = await uploadCloudinary(imageLocalPath);
    if (!image) {
        throw new ApiError(500, "Failed to upload image");
    }

    const course = await Course.create({
        title,
        description,
        image: image?.url,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, course, "Course created successfully"));
});

const addCourseToUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        throw new ApiError(403, "Unauthorized access");
    }

    const user = req.user;

    const { courseId } = req.body;

    if (!courseId) {
        throw new ApiError(400, "Course id is required");
    }

    // check if it was already added
    const isCoursePresent = user.courses.find(
        (course) => course._id.toString() === courseId,
    );

    if (isCoursePresent) {
        throw new ApiError(409, "Course already added");
    }

    // check if there is any course exists with this id
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    user.courses.push(course._id);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Course added successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const courses = await Course.findOne({ title });
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

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.aggregate([
        {
            $project: {
                title: 1,
                description: 1,
                image: 1,
                moduleCount: { $size: "$modules" },
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const getModules = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        throw new ApiError(401, "Unauthorized");
    }

    const { title } = req.body;

    const course = await Course.findOne({ title });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const modules = course.modules;

    return res
        .status(200)
        .json(new ApiResponse(200, modules, "Modules fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
    if (!req?.user || !req.user?.isAdmin) {
        throw new ApiError(403, "Unauthorized access");
    }

    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Missing ID in request");
    }

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

const updateCourseImage = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        throw new ApiError(401, "Unauthorized");
    }

    const { id } = req.params;

    const imageLocalPath = req.file?.path;

    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const image = await uploadCloudinary(imageLocalPath);

    if (!image) {
        throw new ApiError(500, "Failed to upload image");
    }

    const imageUrl = course.image.split("/").pop().split(".")[0];
    await deleteCloudinary(imageUrl);

    course.image = image.url;
    await course.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, course, "Course image updated successfully"),
        );
});

const removeCourseFromUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        throw new ApiError(403, "Unauthorized access");
    }

    const user = req.user;

    const { courseId } = req.body;

    if (!courseId) {
        throw new ApiError(400, "Course id is required");
    }

    // remove course from user
    user.courses = user.courses.filter(
        (courseid) => courseid.toString() !== courseId,
    );
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Course removed successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Missing id in request");
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // delete image from cloudinary
    const image = course.image.split("/").pop().split(".")[0];
    await deleteCloudinary(image);

    const modules = course.modules;

    // Delete each module
    for (const moduleId of modules) {
        await Module.findByIdAndDelete(moduleId);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Course deleted successfully"));
});

export {
    createCourse,
    addCourseToUser,
    getCourses,
    getCourseById,
    getAllCourses,
    getModules,
    updateCourse,
    updateCourseImage,
    removeCourseFromUser,
    deleteCourse,
};
