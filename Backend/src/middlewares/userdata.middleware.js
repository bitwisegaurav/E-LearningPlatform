import { options } from "../constants.js";
import { generateAccessAndRefreshToken } from "../controllers/user.controller.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";

const getUser = asyncHandler(async (req, res, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                console.log("Unauthorized access");
            } else {
                const decodedValues = await jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_TOKEN_SECRET,
                );
                const user = await User.findById(decodedValues?._id).select([
                    "-password",
                ]);
                // refresh accessToken and refreshToken
                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = await generateAccessAndRefreshToken(user._id);
                
                res.cookie("accessToken", newAccessToken, options);
                res.cookie("refreshToken", newRefreshToken, options);
                req.user = user;
            }
        } else {
            const decodedValues = await jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET,
            );

            const user = await User.findById(decodedValues?._id).select(
                "-password -refreshToken",
            );

            if (!user) {
                console.log("User not found");
            } else {   
                req.user = user;
            }
        }
    } catch (error) {
        console.log(error?.message || "Invalid access token");
    } finally {
        next();
    }
});

export { getUser };