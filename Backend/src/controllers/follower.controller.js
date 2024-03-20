import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Followers } from "../models/follower.model.js";
import { User } from "../models/user.model.js";

const followUser = asyncHandler(async (req, res) => {
    const userId = req.params?.userId || req.body?.userId;
    const { username } = req.body;

    console.log(userId, username);

    if(!userId && !username) {
        throw new ApiError(400, "User id or username is required");
    }

    const follower = await User.findById(req.user?._id);
    if (!follower) {
        throw new ApiError(404, "Follower not found");
    }

    const followingTo = await User.findOne({
        $or: [{ username: username }, { _id: userId }],
    });
    if (!followingTo) {
        throw new ApiError(404, "User whom you are following is not found");
    }

    // Check if the user is already following the user
    const isFollowing = await Followers.findOne({
        FollowerId: follower._id,
        FollowingId: followingTo._id,
    });

    if (isFollowing) {
        throw new ApiError(400, "You are already following this user");
    }

    // Create a new document to follow
    const newFollower = await Followers.create({
        FollowerId: follower._id,
        FollowingId: followingTo._id,
    });

    if (!newFollower) {
        throw new ApiError(
            500,
            "Something went wrong while following the user",
        );
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newFollower, "User followed successfully"));
});

const isFollowing = asyncHandler(async (req, res) => {
    const userId = req.params?.userId || req.body?.userId;
    const { username } = req.body;

    if (!userId && !username) {
        throw new ApiError(400, "User id is required");
    }

    const follower = await User.findById(req.user?._id);

    if (!follower) {
        throw new ApiError(404, "Follower not found");
    }

    const followingTo = await User.findOne({
        $or: [{ _id: userId }, { username: username }],
    });

    if (!followingTo) {
        throw new ApiError(404, "User not found");
    }

    const isFollowingResult = await Followers.findOne({
        FollowerId: follower._id,
        FollowingId: followingTo._id,
    });

    const isFollowing = isFollowingResult ? true : false;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                isFollowing,
                isFollowing ? "You are following this user" : "You are not following this user",
            ),
        );
});

const unFollowUser = asyncHandler(async (req, res) => {
    const userId = req.params?.userId || req.body?.userId;
    const { username } = req.body;

    console.log(req.body);

    console.log(userId, username);

    if (!userId && !username) {
        throw new ApiError(400, "User id or username is required");
    }

    const follower = await User.findById(req.user?._id);

    if (!follower) {
        throw new ApiError(404, "Follower not found");
    }

    // Find the user that we want to unfollow from the database
    const followingTo = await User.findOne({
        $or: [{ _id: userId }, { username: username }],
    });

    if (!followingTo) {
        throw new ApiError(404, "User not found");
    }

    // Check if the current logged in user is following the user he wants to unfollow
    if (follower._id.toString() === followingTo._id.toString()) {
        throw new ApiError(400, "You cannot unfollow yourself");
    }

    // Find the document that contains the userId of the user we want to unfollow
    const isFollowing = await Followers.findOne({
        FollowerId: follower._id,
        FollowingId: followingTo._id,
    });

    if (!isFollowing) {
        throw new ApiError(400, "You are not following this user");
    }

    // Remove the relationship between the two users
    const followingDocument = await Followers.findByIdAndDelete(
        isFollowing._id,
    );
    if (!followingDocument) {
        throw new ApiError(
            500,
            "Something went wrong while unfollowing the user",
        );
    }

    // Respond with a success message and status code 200
    return res
        .status(200)
        .json(new ApiResponse(200, "User unfollowed successfully"));
});

export { followUser, isFollowing, unFollowUser };
