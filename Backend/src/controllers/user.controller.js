import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadCloudinary, deleteCloudinary } from "../utils/cloudinary.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { options } from "../constants.js";
import { Followers } from "../models/follower.model.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating acess and refresh token",
        );
    }
};

const registerUserProfile = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body;

    // validation for fields
    if (
        [username, email, name, password].some(
            (field) => !field || field?.trim() === "",
        )
    ) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    // check if user is already exists
    const existedUser = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // check for avatar and coverImage localpaths

    const avatarLocalPath = req.files?.avatar
        ? req.files?.avatar[0]?.path
        : null;
    const coverImageLocalPath = req.files?.coverImage
        ? req.files?.coverImage[0]?.path
        : null;

    if (!avatarLocalPath || !coverImageLocalPath) {
        throw new ApiError(400, "Please provide avatar and coverImage");
    }

    // upload images to cloudinary
    const avatarCloudinaryResponse = await uploadCloudinary(avatarLocalPath);
    const coverImageCloudinaryResponse = await uploadCloudinary(coverImageLocalPath);

    if (!avatarCloudinaryResponse || !coverImageCloudinaryResponse) {
        throw new ApiError(500, "Error while uploading images to cloudinary");
    }

    // create user
    const user = await User.create({
        username: username.toLowerCase(),
        name,
        email,
        password,
        avatar: avatarCloudinaryResponse.url,
        coverImage: coverImageCloudinaryResponse.url,
    });

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user?._id,
    );

    const findCreatedUser = await User.findById(user?._id).select(
        "-password -refreshToken",
    );

    // check if user is created or not
    if (!findCreatedUser) {
        throw new ApiError(500, "Error while creating user");
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User created successfully",
            data: {...findCreatedUser.toObject()},
        });
});

const getUserProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const user = await User.aggregate([
        {
            $match: {
                _id: req.user?._id,
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "courses",
                foreignField: "_id",
                as: "courses",
                pipeline: [
                    {
                        $addFields: {
                            modulesCount: { $size: "$modules" },
                        },
                    },
                    {
                        $project: {
                            modules: 0,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "articles",
                localField: "_id",
                foreignField: "owner",
                as: "articles",
                pipeline: [
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            imageURL: 1,
                            createdAt: 1,
                            likesCount: 1,
                            body: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "FollowingId",
                as: "followers",
            },
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "FollowerId",
                as: "following",
            },
        },
        {
            $addFields: {
                followers: {
                    $size: "$followers",
                },
                following: {
                    $size: "$following",
                }
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
            },
        },
    ]);

    if (!user) {
        return next(new ApiError(404, "User not found"));
    }

    const responseData = {
        user: user[0],
        isFollowedByAccessingUser: false,
        isFollowingAccessingUser: false,
        isBothSame: true
    };

    return res
        .status(200)
        .json(new ApiResponse(200, responseData, "User Fetched Successfully"));
});

const getUserProfileByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "courses",
                foreignField: "_id",
                as: "courses",
                pipeline: [
                    {
                        $addFields: {
                            modulesCount: { $size: "$modules" },
                        },
                    },
                    {
                        $project: {
                            modules: 0,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "articles",
                localField: "_id",
                foreignField: "owner",
                as: "articles",
                pipeline: [
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            imageURL: 1,
                            createdAt: 1,
                            likesCount: 1,
                            body: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "FollowingId",
                as: "followers",
            },
        },
        {
            $lookup: {
                from: "followers",
                localField: "_id",
                foreignField: "FollowerId",
                as: "following",
            },
        },
        {
            $addFields: {
                followers: {
                    $size: "$followers",
                },
                following: {
                    $size: "$following",
                }
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
            },
        },
    ]);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check if user is logged in that they follow each other or not
    let isFollowedByAccessingUser = false;
    let isFollowingAccessingUser = false;
    const accessingUser = req.user?._id;
    const accessedUser = user[0]?._id;
    const isBothSame = accessingUser.toString() === accessedUser.toString();

    if (accessingUser && accessedUser && accessingUser !== accessedUser) {

        const accessingUserFollowing = await Followers.findOne({ 
           $and: [
                { FollowerId: accessingUser },
                { FollowingId: accessedUser }
           ]
        });

        const accessingUserFollowed = await Followers.findOne({ 
            $and: [
                { FollowerId: accessedUser },
                { FollowingId: accessingUser }
            ]
        });

        if(accessingUserFollowing) isFollowedByAccessingUser = true;
        if(accessingUserFollowed) isFollowingAccessingUser = true;
    }

    const responseData = {
        user: user[0],
        isFollowedByAccessingUser,
        isFollowingAccessingUser,
        isBothSame
    };

    return res.status(200).json(new ApiResponse(200, responseData));
});

const getUserCourses = asyncHandler(async (req, res) => {
    if(!req.user){
        throw new ApiError(401, "Please login to access this route");
    }

    const user = req.user;

    return res.status(200).json(new ApiResponse(200, {courses: user.courses}, "Courses fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");

    if(!users){
        throw new ApiError(404, "No users found");
    }

    // get all the usersId which are followed by accessing user
    const accessingUser = req.user?._id;

    const following = accessingUser ? await Followers.find({ FollowerId: accessingUser }) : [];

    const followingIds = following.map((follower) => follower.FollowingId);

    const responseData = {
        users: users.map((user) => {
            return {
                ...user.toObject(),
                isFollowedByAccessingUser: followingIds.includes(user._id)
            }
        })
    }

    return res.status(200).json(new ApiResponse(200, responseData, "Users fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const { username, name, email } = req.body;

    // validation for fields
    if (!username && !name && !email) {
        throw new ApiError(400, "Please provide at least one field to update");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                ...(username && { username }),
                ...(email && { email }),
                ...(name && { name }),
            },
        },
        { new: true },
    ).select("-password -refreshToken");

    const responseData = {
        user,
        message: "Profile updated successfully",
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // validation for fields
    if (!password || !(username || email)) {
        throw new ApiError(400, "Please provide login details");
    }

    // check if user is exists
    const user = await User.findOne({
        $or: [{ username: username?.toLowerCase() }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User with username or email not found");
    }

    // compare the passwords
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect");
    }

    // create access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user?._id,
    );

    // remove password and refreshToken from user
    const responseUser = user.toObject();
    delete responseUser.password;
    delete responseUser.refreshToken;

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("username", user.username, options)
        .json(
            new ApiResponse(200, {
                message: "User logged in successfully",
                data: {
                    responseUser,
                },
            }),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        },
    });

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {
                message: "User logged out successfully",
            }),
        );
});

const updateUserPassword = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
        throw new ApiError(400, "Please provide new password");
    }

    const user = await User.findById(req.user._id);

    // Check if the provided current password is correct
    const isCurrentPasswordCorrect = await user.isPasswordCorrect(
        password,
        user.password,
    );
    if (!isCurrentPasswordCorrect) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // Update the password
    user.password = newPassword;

    // Save the updated user data
    await user.save();

    const responseData = {
        message: "Password changed successfully",
    };

    return res.status(200).json(new ApiResponse(200, responseData));
});

const deleteUserAccount = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const user = req.user;

    // delete avatar image from cloudinary
    const avatar = user.avatar.split("/").pop().split(".")[0];

    const isAvatarDeleted = await deleteCloudinary(avatar);

    if (!isAvatarDeleted) {
        console.log("Failed to delete avtavar image");
    }

    // delete cover image from cloudinary
    const coverImage = user.coverImage.split("/").pop().split(".")[0];

    const isCoverImageDeleted = await deleteCloudinary(coverImage);

    if (!isCoverImageDeleted) {
        console.log("Failed to delete cover image");
    }

    // Delete the user from the database
    const response = await User.findByIdAndDelete(user._id);

    if (!response) {
        throw new ApiError(404, "User not found");
    }

    const responseData = {
        message: "Account deleted successfully",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, responseData));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    // check if refresh token is present
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Please login again");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        // find user by id
        const user = await User.findById(decodedToken?._id);

        // check if user is exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // check if refresh token is correct
        if (user.refreshToken && user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(400, "Please login again");
        }

        // generate new access and refresh tokens
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user?._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    message: "Access token refreshed successfully",
                }),
            );
    } catch (error) {
        throw new ApiError(404, error?.message || "Invalid Refresh Token");
    }
});

const updateAvatarImage = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please provide avatar image");
    }

    // delete previous avatar image from cloudinary
    const previousAvatar = req.user.avatar.split("/").pop().split(".")[0];

    const isDeleted = await deleteCloudinary(previousAvatar);

    if (!isDeleted) {
        console.log("Failed to delete avatar image");
    }

    // upload image on cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    // find user from database
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true },
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    if (!req.user) {
        return next(new ApiError(401, "Please login to access this route"));
    }

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Please provide cover image");
    }

    // delete previous cover image from cloudinary
    const previousCoverImage = req.user.coverImage
        .split("/")
        .pop()
        .split(".")[0];

    const isDeleted = await deleteCloudinary(previousCoverImage);

    if (!isDeleted) {
        console.log("Failed to delete cover image");
    }

    // upload image on cloudinary
    const coverImage = await uploadCloudinary(coverImageLocalPath);

    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    // find user from database
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        { new: true },
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image updated successfully"));
});

export {
    generateAccessAndRefreshToken,
    registerUserProfile,
    getUserProfile,
    getUserProfileByUsername,
    getUserCourses,
    getAllUsers,
    updateUserProfile,
    loginUser,
    logoutUser,
    updateUserPassword,
    deleteUserAccount,
    refreshAccessToken,
    updateAvatarImage,
    updateCoverImage,
};
