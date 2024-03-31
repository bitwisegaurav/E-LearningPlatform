import Router from "express";
import {
    registerUserProfile,
    getUserProfile,
    getUserProfileByUsername,
    updateUserProfile,
    loginUser,
    logoutUser,
    updateUserPassword,
    deleteUserAccount,
    refreshAccessToken,
    updateAvatarImage,
    updateCoverImage,
    getUserCourses,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getUser } from "../middlewares/userdata.middleware.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving users data perfectly",
        status: 200,
    });
});
router.route("/register-user").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUserProfile,
);
router.route("/get-user").get(verifyUser, getUserProfile);
router.route("/get-user/:username").get(getUser, getUserProfileByUsername);
router.route("/get-courses").get(verifyUser, getUserCourses);
router.route("/update-user").patch(verifyUser, updateUserProfile);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUser, logoutUser);
router.route("/update-password").patch(verifyUser, updateUserPassword);
router.route("/delete-account").delete(verifyUser, deleteUserAccount);
router.route("/refresh-access-token").put(verifyUser, refreshAccessToken);
router
    .route("/update-avatar-image")
    .patch(verifyUser, upload.single("avatar"), updateAvatarImage);
router
    .route("/update-cover-image")
    .patch(verifyUser, upload.single("coverImage"), updateCoverImage);

export default router;
