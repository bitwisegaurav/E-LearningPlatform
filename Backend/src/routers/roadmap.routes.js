import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createRoadmap,
    deleteRoadmap,
    getRoadmapByDetails,
    getRoadmaps,
    updateRoadmap,
    updateRoadmapImage,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router
    .route("/create-roadmap")
    .post(verifyUser, verifyAdmin, upload.single("image"), createRoadmap);
router.route("/get-roadmaps").get(verifyUser, getRoadmaps);
router.route("/get-roadmapByDetails/:id").get(verifyUser, getRoadmapByDetails);
router
    .route("/update-roadmap/:id")
    .patch(verifyUser, verifyAdmin, updateRoadmap);
router.route("/update-roadmap-image/:id").patch(verifyUser, verifyAdmin, upload.single("image"), updateRoadmapImage);
router
    .route("/delete-roadmap/:id")
    .delete(verifyUser, verifyAdmin, deleteRoadmap);

export default router;
