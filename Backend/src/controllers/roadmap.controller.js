import { Roadmap } from "../models/roadmap.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.util.js";
import { Course } from "../models/course.model.js";

const createRoadmap = asyncHandler(async (req, res) => {
    const { title, description, courseTitle } = req.body;

    if (
        [title, description, courseTitle].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // take image and upload it
    const imageLocalPath = req.file?.path;
    let image = null;
    if (imageLocalPath) {
        const imageCloudinaryPath = await uploadImage(imageLocalPath);
        if (!imageCloudinaryPath) {
            throw new ApiError(
                500,
                "Something went wrong while uploading image",
            );
        }

        image = imageCloudinaryPath.url;
    } else {
        const course = await Course.findOne({ title: courseTitle });
        image = course.image;
    }

    const roadmap = await Roadmap.create({
        title,
        ...(image && { image }),
        description,
        course: courseTitle,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, roadmap, "Roadmap created successfully"));
});

const getRoadmaps = asyncHandler(async (req, res) => {
    const roadmap = await Roadmap.find().select("-description");

    return res
        .status(200)
        .json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

const getRoadmapByDetails = asyncHandler(async (req, res) => {
    const { id, title, courseTitle } = req.body;

    if (!id && !title && !courseTitle) {
        throw new ApiError(
            400,
            "Provide one of the following: id, title or courseTitle",
        );
    }

    const roadmap = await Roadmap.findOne({
        $or: [{ _id: id }, { title: title }, { course: courseTitle }],
    });

    if (!roadmap) {
        throw new ApiError(404, "Roadmap not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

const updateRoadmap = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Roadmap id is required");
    }

    const { title, description, courseTitle } = req.body;

    if (
        [id, title, description, courseTitle].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Atleast one field is required");
    }

    const course = courseTitle;

    const roadmap = await Roadmap.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(course && { course }),
            },
        },
        { new: true },
    );

    if (!roadmap) {
        throw new ApiError(404, "Roadmap not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, roadmap, "Roadmap updated successfully"));
});

const updateRoadmapImage = asyncHandler(async (req, res) => {
    const id = req.params?.id || req.body?.id;

    const imageLocalPath = req.file?.path;
    const image = await uploadImage(imageLocalPath);

    if (!image) {
        throw new ApiError(500, "Something went wrong while uploading image");
    }

    const roadmap = await Roadmap.findById(id);

    // Delete old image from cloudinary
    if (roadmap?.image) {
        const publicId = roadmap.image.split("/").pop().split(".")[0];
        await deleteImage(publicId);
    }

    // Update image in database
    roadmap.image = image.url;
    await roadmap.save();

    return res
        .status(200)
        .json(new ApiResponse(200, roadmap, "Roadmap updated successfully"));
});

const deleteRoadmap = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const roadmap = await Roadmap.findByIdAndDelete(id);

    if (!roadmap) {
        throw new ApiError(404, "Roadmap not found");
    }

    // delete image from cloudinary
    const image = roadmap.image;
    if (image) {
        const publicId = image.split("/").pop().split(".")[0];
        await deleteImage(publicId);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Roadmap deleted successfully"));
});

export {
    createRoadmap,
    getRoadmaps,
    getRoadmapByDetails,
    updateRoadmap,
    updateRoadmapImage,
    deleteRoadmap,
};
