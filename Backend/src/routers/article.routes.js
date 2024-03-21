import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyArticleOwner } from "../middlewares/authArticle.middleware.js";
import {
    createArticle,
    deleteArticle,
    getArticleById,
    getArticles,
    likeArticle,
    updateArticle,
    updateArticleImage,
} from "../controllers/article.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// router.use(verifyUser); // all articles routes need authentication

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router.route("/create-article").post(verifyUser, upload.single('image'), createArticle);
router.route("/get-articles").get(verifyUser, getArticles);
router.route("/get-articleById/:id").get(verifyUser, getArticleById);
router.route("/like-article/:id").patch(verifyUser, likeArticle);
router
    .route("/update-article/:id")
    .patch(verifyUser, verifyArticleOwner, updateArticle);
router.route('/update-article-image/:id').patch(verifyUser, verifyArticleOwner, upload.single('image'), updateArticleImage);
router
    .route("/delete-article/:id")
    .delete(verifyUser, verifyArticleOwner, deleteArticle);

export default router;
