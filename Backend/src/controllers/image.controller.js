import { ApiError } from "../utils/ApiError.util";
import { ApiResponse } from "../utils/ApiResponse.util";
import { asyncHandler } from "../utils/asyncHandler.util";
import { uploadImage } from "../utils/cloudinary.util";

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
