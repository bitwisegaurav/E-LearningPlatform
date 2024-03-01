import { Roadmaps } from "../models/roadmaps.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createRoadmap = asyncHandler(async (req, res) => {
  const { title, description, course } = req.body;

  if (![title, description, course].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const roadmap = await Roadmaps.create({
    title,
    description,
    course,
  });

  return res.status(201).json(new ApiResponse(201, roadmap, "Roadmap created successfully"));
});

const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmaps.find().populate("course", "-modules");

  return res.status(200).json(new ApiResponse(200, roadmaps, "Roadmaps fetched successfully"));
});

const getRoadmapById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const roadmap = await Roadmaps.findById(id).populate("course", "-modules");

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

const updateRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, course } = req.body;

  if (![title, description, course].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const roadmap = await Roadmaps.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        course,
      },
    },
    { new: true }
  ).populate("course", "-modules");

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap updated successfully"));
});

const deleteRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const roadmap = await Roadmaps.findByIdAndDelete(id).populate("course", "-modules");

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap deleted successfully"));
});

export { createRoadmap, getRoadmaps, getRoadmapById, updateRoadmap, deleteRoadmap };