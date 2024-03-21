import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { uploadImage } from "../utils/cloudinary.util.js";

const uploadImageHandler = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath || imageLocalPath.trim() === "") {
        throw new ApiError(400, "Image is required");
    }

    const image = await uploadImage(imageLocalPath);

    if (!image) {
        throw new ApiError(500, "Failed to upload image");
    }

    return res.status(201).json(
        new ApiResponse({
            data: image.url,
            message: "Image uploaded successfully",
        }),
    );
});

export { uploadImageHandler };
