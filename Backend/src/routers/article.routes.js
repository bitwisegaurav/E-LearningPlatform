import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle } from "../controllers/article.controller.js";


const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router.route('/create-article').post(verifyUser, verifyAdmin, createArticle);
router.route('/get-articles').get(verifyUser, getArticles);
router.route('/get-article/:id').get(verifyUser, getArticleById);
router.route('/update-article/:id').patch(verifyUser, verifyAdmin, updateArticle); // TODO : Add middleware to check if the article belongs to the user
router.route('/delete-article/:id').delete(verifyUser, verifyAdmin, deleteArticle); // TODO : Add middleware to check if the article belongs to the user

export default router;
