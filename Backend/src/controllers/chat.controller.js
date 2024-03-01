import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createChat = asyncHandler(async (req, res) => {
  const { message, from, to } = req.body;

  if (![message, from, to].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const chat = await Chat.create({
    message,
    from,
    to,
  });

  return res.status(201).json(new ApiResponse(201, chat, "Chat created successfully"));
});

const getChats = asyncHandler(async (__, res) => {
  const chats = await Chat.find().populate("from to", "-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, chats, "Chats fetched successfully"));
});

const getChatById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chat = await Chat.findById(id).populate("from to", "-password -refreshToken");

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return res.status(200).json(new ApiResponse(200, chat, "Chat fetched successfully"));
});

const updateChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, from, to } = req.body;

  if (![message, from, to].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const chat = await Chat.findByIdAndUpdate(
    id,
    {
      $set: {
        message,
        from,
        to,
      },
    },
    { new: true }
  ).populate("from to", "-password -refreshToken");

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return res.status(200).json(new ApiResponse(200, chat, "Chat updated successfully"));
});

const deleteChat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chat = await Chat.findByIdAndDelete(id).populate("from to", "-password -refreshToken");

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return res.status(200).json(new ApiResponse(200, chat, "Chat deleted successfully"));
});

export { createChat, getChats, getChatById, updateChat, deleteChat };