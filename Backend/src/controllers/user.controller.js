import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const options = {
    httpOnly: true,
    secure: true,
};

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
        [username, email, name, password].some((field) => field?.trim() === "")
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
    const avatarCloudinaryResponse = await uploadImage(avatarLocalPath);
    const coverImageCloudinaryResponse = await uploadImage(coverImageLocalPath);

    if (!avatarCloudinaryResponse || !coverImageCloudinaryResponse) {
        throw new ApiError(500, "Error while uploading images to cloudinary");
    }

    // create user
    const user = await User.create({
        username: username.toLowerCase(),
        name,
        email,
        password,
        profilePic: avatarCloudinaryResponse.url,
        coverImage: coverImageCloudinaryResponse.url,
    }).select("-password");

    // check if user is created or not
    if (!user) {
        throw new ApiError(500, "Error while creating user");
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user?._id,
    );

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User created successfully",
            data: {
                user,
            },
        });
});

const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = req.user;

    const responseData = {
        user,
    };

    return res.status(200).json(new ApiResponse(200, responseData));
});

const getUserProfileByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() }).select(
        "-password -refreshToken",
    );

    const responseData = {
        user,
    };

    res.status(200).json(new ApiResponse(200, responseData));
});

const updateUserProfile = asyncHandler(async (req, res) => {
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
                ...(fullName && { fullName }),
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
    if (!password || !(username && email)) {
        throw new ApiError(400, "Please provide login details");
    }

    // check if user is exists
    const user = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email }],
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
    .json(new ApiResponse(200, {
        message: "User logged in successfully",
        data: {
            responseUser,
        },
    }));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        },
    });

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {
        message: "User logged out successfully",
    }))
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const { password, newPassword } = req.body;
    
    if (!password || !newPassword) {
      throw new ApiError(400, "Please provide new password");
    }
    
    const user = req.user;
  
    // Check if the provided current password is correct
    const isCurrentPasswordCorrect = await user.isPasswordCorrect(password);
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
    const user = req.user;

    // Delete the user from the database
    await user.remove();

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
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    // check if refresh token is present
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Please login again");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

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
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user?._id,
        );

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            message: "Access token refreshed successfully",
        }));

    } catch (error) {
        throw new ApiError(404, error?.message || "Invalid Refresh Token");
    }
})

const updateAvatarImage = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Please provide avatar image");
    }

    // delete previous avatar image from cloudinary
    const previousAvatar = req.user.avatar.split('/').pop().split('.')[0];

    const isDeleted = await deleteImage(previousAvatar);

    if (!isDeleted) {
        console.log("Failed to delete avtavar image");
    }

    // upload image on cloudinary
    const avatar = await uploadImage(avatarLocalPath);

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

export {
    registerUserProfile,
    getUserProfile,
    getUserProfileByUsername,
    updateUserProfile,
    loginUser,
    logoutUser,
    updateUserPassword,
    deleteUserAccount,
    refreshAccessToken,
    updateAvatarImage,
};
