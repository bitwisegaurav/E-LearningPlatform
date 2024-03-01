import { Articles } from "../models/articles.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const createArticle = asyncHandler(async (req, res) => {
  const { title, body, imageURLs } = req.body;

  if (![title, body].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title and body are required");
  }

  const article = await Articles.create({
    title,
    body,
    imageURLs,
    owner: req.user._id, // Assuming you have authentication middleware setting req.user
  });

  return res.status(201).json(new ApiResponse(201, article, "Article created successfully"));
});

const getArticles = asyncHandler(async (req, res) => {
  const articles = await Articles.find().populate("owner", "-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, articles, "Articles fetched successfully"));
});

const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findById(id).populate("owner", "-password -refreshToken");

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return res.status(200).json(new ApiResponse(200, article, "Article fetched successfully"));
});

const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, body, imageURLs } = req.body;

  if (![title, body].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title and body cannot be empty");
  }

  const article = await Articles.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        body,
        imageURLs,
      },
    },
    { new: true }
  ).populate("owner", "-password -refreshToken");

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return res.status(200).json(new ApiResponse(200, article, "Article updated successfully"));
});

const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Articles.findByIdAndDelete(id).populate("owner", "-password -refreshToken");

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return res.status(200).json(new ApiResponse(200, article, "Article deleted successfully"));
});

export { createArticle, getArticles, getArticleById, updateArticle, deleteArticle };