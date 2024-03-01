import { Communities } from "../models/communities.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createCommunity = asyncHandler(async (req, res) => {
  const { title, description, image, members } = req.body;

  if (![title, description, image, members].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const community = await Communities.create({
    title,
    description,
    image,
    members,
  });

  return res.status(201).json(new ApiResponse(201, community, "Community created successfully"));
});

const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Communities.find().populate("members", "-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, communities, "Communities fetched successfully"));
});

const getCommunityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Communities.findById(id).populate("members", "-password -refreshToken");

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res.status(200).json(new ApiResponse(200, community, "Community fetched successfully"));
});

const updateCommunity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, image, members } = req.body;

  if (![title, description, image, members].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const community = await Communities.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        image,
        members,
      },
    },
    { new: true }
  ).populate("members", "-password -refreshToken");

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res.status(200).json(new ApiResponse(200, community, "Community updated successfully"));
});

const deleteCommunity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const community = await Communities.findByIdAndDelete(id).populate("members", "-password -refreshToken");

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res.status(200).json(new ApiResponse(200, community, "Community deleted successfully"));
});

export { createCommunity, getCommunities, getCommunityById, updateCommunity, deleteCommunity };