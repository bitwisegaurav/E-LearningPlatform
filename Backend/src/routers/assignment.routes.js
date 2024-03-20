import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    createAssignment,
    deleteAssignment,
    getAssignmentById,
    getAssignments,
    updateAssignment,
} from "../controllers/assignment.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    // This is a simple route that returns a response with a message and a status code.
    const msg = "Server is up!";
    const statusCode = 200;
    return res.status(statusCode).json({ message: msg, status: statusCode });
});

router
    .route("/create-assignment")
    .post(verifyUser, verifyAdmin, createAssignment);
router.route("/get-assignments").get(verifyUser, getAssignments);
router.route("/get-assignmentById/:id").get(verifyUser, getAssignmentById);
router.route("/update-assignment/:id").patch(verifyUser, verifyAdmin, updateAssignment);
router.route("/delete-assignment/:id").delete(verifyUser, verifyAdmin, deleteAssignment);

export default router;
