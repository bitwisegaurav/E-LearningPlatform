import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createCourse,
    getCourses,
    getCourseById,
    getModules,
    updateCourse,
    updateCourseImage,
    deleteCourse,
    addCourseToUser,
    removeCourseFromUser,
} from "../controllers/course.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router
    .route("/create-course")
    .post(verifyUser, verifyAdmin, upload.single("image"), createCourse);
router.route("/add-course-to-user").post(verifyUser, verifyAdmin, addCourseToUser);
router.route("/get-course").get(verifyUser, getCourses);
router.route("/get-courseById/:id").get(verifyUser, getCourseById);
router.route("/get-modules").get(verifyUser, getModules);
router.route("/update-course-details/:id").patch(verifyUser, verifyAdmin, updateCourse);
router
    .route("/update-course-image/:id")
    .patch(verifyUser, verifyAdmin, upload.single("image"), updateCourseImage);
router.route("/remove-course-from-user").patch(verifyUser, verifyAdmin, removeCourseFromUser);
router.route("/delete-course/:id").delete(verifyUser, verifyAdmin, deleteCourse);

export default router;
