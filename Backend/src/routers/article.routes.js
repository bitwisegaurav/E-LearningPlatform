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
} from "../controllers/article.controller.js";

const router = Router();
// router.use(verifyUser); // all articles routes need authentication

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router.route("/create-article").post(verifyUser, createArticle);
router.route("/get-articles").get(verifyUser, getArticles);
router.route("/get-article/:id").get(verifyUser, getArticleById);
router.route("/like-article/:id").patch(verifyUser, likeArticle);
router
    .route("/update-article/:id")
    .patch(verifyUser, verifyArticleOwner, updateArticle);
router
    .route("/delete-article/:id")
    .delete(verifyUser, verifyArticleOwner, deleteArticle);

export default router;
