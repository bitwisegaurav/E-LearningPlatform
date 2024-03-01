import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const verifyAdmin = asyncHandler(async (req, _, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        throw new ApiError(403, "Admin access required");
    }
});

export { verifyAdmin };
