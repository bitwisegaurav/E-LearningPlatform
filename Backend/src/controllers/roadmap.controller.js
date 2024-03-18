import { Roadmaps } from "../models/roadmaps.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createRoadmap = asyncHandler(async (req, res) => {
  const { title, description, courseId, courseTitle } = req.body;

  if (![title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if(!courseId || !courseTitle) {
    throw new ApiError(400, "Provide one of the following: courseId or courseTitle");
  }

  const course = await Course.findOne({ $or: [{ _id: courseId }, { title: courseTitle }] });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const roadmap = await Roadmaps.create({
    title,
    description,
    course: course._id,
  });

  return res.status(201).json(new ApiResponse(201, roadmap, "Roadmap created successfully"));
});

const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmaps.find().populate('course', 'title');

  return res.status(200).json(new ApiResponse(200, roadmaps, "Roadmaps fetched successfully"));
});

const getRoadmapByDetails = asyncHandler(async (req, res) => {
  const { id, title, courseTitle } = req.body;

  if (!id && !title && !courseTitle) {
    throw new ApiError(400, "Provide one of the following: id, title or courseTitle");
  }

  const course = courseTitle ? await Course.findOne({ title: courseTitle }) : null;

  if(courseTitle && !course) {
    throw new ApiError(404, "Course not found");
  }

  const roadmap = await Roadmaps.findOne({ $or: [{ _id: id }, { title: title }, { course: course._id }] }).populate('course', 'title');

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }
  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

const updateRoadmap = asyncHandler(async (req, res) => {
  const { id, title, description, course } = req.body;

  if (![id, title, description, course].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const roadmap = await Roadmaps.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(course && { course }),
      },
    },
    { new: true }
  ).populate("course", "title");

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap updated successfully"));
});

const deleteRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const roadmap = await Roadmaps.findByIdAndDelete(id);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res.status(200).json(new ApiResponse(200, "Roadmap deleted successfully"));
});

export { createRoadmap, getRoadmaps, getRoadmapByDetails, updateRoadmap, deleteRoadmap };