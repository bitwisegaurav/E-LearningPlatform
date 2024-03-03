import Router from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import {
    createModule,
    getModuleById,
    updateModule,
    deleteModule,
} from "../controllers/module.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

/**
 * export { createModule, getModuleById, updateModule, deleteModule };
 */

router.route("/create-module").post(verifyUser, verifyAdmin, createModule);
router.route("/get-module/:id").get(verifyUser, getModuleById);
router.route("/update-module/:id").patch(verifyUser, verifyAdmin, updateModule);
router.route("/delete-module/:id").delete(verifyUser, verifyAdmin, deleteModule);

export default router;
