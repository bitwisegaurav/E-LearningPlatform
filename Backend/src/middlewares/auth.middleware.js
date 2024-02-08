import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized access");
        }

        const decodedValues = await jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
        );

        const user = await User.findById(decodedValues?._id).select(
            "-password -refreshToken",
        );

        if (!user) {
            throw new ApiError(404, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export { verifyJWT };
