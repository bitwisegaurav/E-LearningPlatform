import { Article } from "../models/article.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { deleteImage } from "../utils/cloudinary.util.js";

const createArticle = asyncHandler(async (req, res) => {
    const { title, body, imageURL } = req.body;

    if ([title, body, imageURL].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and body are required");
    }

    const article = await Article.create({
        title,
        body,
        imageURL,
        owner: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, article, "Article created successfully"));
});

const getArticles = asyncHandler(async (req, res) => {
    const articles = await Article.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",

                pipeline: {
                    $project: {
                        _id: 1,
                        username: 1,
                        name: 1,
                        avatar: 1,
                    },
                },
            },
        },
        {
            $addFields: {
                owner: {
                    $arrayElemAt: ["$owner", 0],
                },
                likesCount: {
                    $size: "$likes",
                },
            },
        },
        {
            $project: {
                likes: 0,
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, articles, "Article fetched successfully"));
});

const getArticleById = asyncHandler(async (req, res) => {
    const id = req.params?.id || req.body?.id;

    if (!id) {
        throw new ApiError(400, "Article id is required");
    }

    const article = await Article.findById(id).populate(
        "owner",
        "username name avatar",
    );

    if (!article) {
        throw new ApiError(404, "Article not found");
    }

    // add likesCount field and remove likes field
    article.likesCount = article.likes.length;
    delete article.likes;

    return res
        .status(200)
        .json(new ApiResponse(200, article, "Article fetched successfully"));
});

const likeArticle = asyncHandler(async (req, res) => {
    const id = req.params?.id || req.body?.id;

    if (!id) {
        throw new ApiError(400, "Article id is required");
    }

    const article = await Article.findById(id);

    if (!article) {
        throw new ApiError(404, "Article not found");
    }

    article.likes.push(req.user?._id);
    try {
        await article.save();
    } catch (error) {
        throw new ApiError(500, "Failed to like article");
    }

    article.likesCount = article.likes.length;

    return res
        .status(200)
        .json(new ApiResponse(200, article, "Article liked successfully"));
});

const updateArticle = asyncHandler(async (req, res) => {
    const { title, body, imageURL } = req.body;

    if (!title && !body && !imageURL) {
        throw new ApiError(
            400,
            "Provide atleast one detail of the article to update",
        );
    }

    if (imageURL?.trim().length) {
        const article = req.article;
        if (!article && !article.imageURL) {
            throw new ApiError(404, "Article or image is not found");
        }

        // delete previous image
        const previousImage = article.imageURL.split("/").pop().split(".")[0];
        const isDeleted = await deleteImage(previousImage);
        if (!isDeleted) {
            throw new ApiError(500, "Failed to delete previous image");
        }
    }

    const id = req.article._id;

    const updatedArticle = await Article.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(title && { title }),
                ...(body && { body }),
                ...(imageURL && { imageURL }),
            },
        },
        { new: true },
    );

    if (!updatedArticle) {
        throw new ApiError(404, "Some error occured while updating article");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedArticle,
                "Article updated successfully",
            ),
        );
});

const deleteArticle = asyncHandler(async (req, res) => {
    if(!req.article?.id) {
        throw new ApiError(404, "Article not found");
    }

    const article = await Article.findById(req.article._id);

    if (!article) {
        throw new ApiError(404, "Article not found");
    }

    // delete image
    if (article.imageURL) {
        const imageName = article.imageURL.split("/").pop().split(".")[0];
        const isDeleted = await deleteImage(imageName);
        if (!isDeleted) {
            throw new ApiError(500, "Failed to delete image");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Article deleted successfully"));
});

export {
    createArticle,
    getArticles,
    getArticleById,
    likeArticle,
    updateArticle,
    deleteArticle,
};
