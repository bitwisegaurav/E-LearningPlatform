import Router from "express";
import { registerUserProfile } from "../controllers/user.controller";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving users data perfectly",
        status: 200,
    });
});
router.route("/registerUser").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUserProfile,
);

export default router;
