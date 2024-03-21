import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    createSubject,
    deleteSubject,
    getSubjectById,
    getSubjects,
    updateSubject,
} from "../controllers/subject.controller.js";

const router = Router();

router.route("/create-subject").post(verifyUser, verifyAdmin, createSubject);
router.route("/get-subjects").get(verifyUser, getSubjects);
router.route("/get-subjectById/:id").get(verifyUser, getSubjectById);
router.route("/update-subject/:id").patch(verifyUser, verifyAdmin, updateSubject);
router
    .route("/delete-subject/:id")
    .delete(verifyUser, verifyAdmin, deleteSubject);

export default router;
