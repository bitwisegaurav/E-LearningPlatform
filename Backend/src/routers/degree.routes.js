import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    createDegree,
    deleteDegree,
    getDegreeById,
    getDegrees,
    updateDegree,
} from "../controllers/degree.controller.js";

const router = Router();

router.route("/create-degree").post(verifyUser, verifyAdmin, createDegree);
router.route("/get-degrees").get(verifyUser, getDegrees);
router.route("/get-degree/:id").get(verifyUser, getDegreeById);
router.route("/update-degree/:id").patch(verifyUser, verifyAdmin, updateDegree);
router.route("/delete-degree").delete(verifyUser, verifyAdmin, deleteDegree);

export default router;
