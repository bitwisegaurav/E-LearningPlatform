import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    createInterviewQuestion,
    deleteInterviewQuestion,
    getInterviewQuestionById,
    getInterviewQuestions,
    updateInterviewQuestion,
} from "../controllers/interviewQuestion.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router.route("/create").post(verifyUser, verifyAdmin, createInterviewQuestion);
router.route("/get-questions").get(verifyUser, getInterviewQuestions);
router.route("/get-question/:id").get(verifyUser, getInterviewQuestionById);
router
    .route("/update/:id")
    .patch(verifyUser, verifyAdmin, updateInterviewQuestion);
router
    .route("/delete/:id")
    .delete(verifyUser, verifyAdmin, deleteInterviewQuestion);

export default router;
