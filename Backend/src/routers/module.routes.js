import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyAdmin } from "../middlewares/adminAuth.middleware";
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

router.route("/create-module").post(verifyJWT, verifyAdmin, createModule);
router.route("/get-module/:id").get(verifyJWT, getModuleById);
router.route("/update-module/:id").patch(verifyJWT, verifyAdmin, updateModule);
router.route("/delete-module/:id").delete(verifyJWT, verifyAdmin, deleteModule);

export default router;
