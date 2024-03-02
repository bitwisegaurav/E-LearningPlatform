import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/adminAuth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
    createCourse,
    getCourses,
    getCourseById,
    getModules,
    updateCourse,
    updateCourseImage,
    deleteCourse,
} from "../controllers/course.controller";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

/**
 * export { createCourse, getCourses, getCourseById, getModules, updateCourse, deleteCourse };
 */

router
    .route("/create-course")
    .post(verifyJWT, verifyAdmin, upload.single("image"), createCourse);
router.route("/get-courses").get(verifyJWT, getCourses);
router.route("/get-course/:id").get(verifyJWT, getCourseById);
router.route("/get-modules").get(verifyJWT, getModules);
router.route("/update-course-details/:id").patch(verifyJWT, verifyAdmin, updateCourse);
router
    .route("/update-course-image/:id")
    .patch(verifyJWT, verifyAdmin, upload.single("image"), updateCourseImage);
router.route("/delete-course/:id").delete(verifyJWT, verifyAdmin, deleteCourse);

export default router;
