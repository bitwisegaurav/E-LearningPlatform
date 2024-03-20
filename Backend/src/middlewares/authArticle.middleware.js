import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const verifyArticleOwner = asyncHandler(async (req, _, next) => {
    try {
        const userId = req.user?.id;
        const articleId = req.params?.id || req.body?.id;
    
        if(!userId) {
            throw new ApiError(401, "You are not logged in");
        }
    
        if(!articleId) {
            throw new ApiError(400, "Article id is required");
        }
    
        // Check if the user owns the article
        const article = await Article.findById(articleId);
        
        if(!article) {
            throw new ApiError(404, "Article not found");
        }
    
        if(article.owner.toString() !== userId && !req.user?.isAdmin) {
            throw new ApiError(403, "You are not allowed to perform this action");
        }
    
        req.article = article;
        return next();
    } catch (error) {
        throw new ApiError(500, "Something went wrong while verifying article owner" + error.message);
    }
});

export { verifyArticleOwner };
