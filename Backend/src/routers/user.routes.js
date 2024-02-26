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
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

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
router.route("/get-user").get(verifyJWT, getUserProfile);
router.route("/get-user/:username").get(getUserProfileByUsername);
router.route("/update-user").patch(verifyJWT, updateUserProfile);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-password").patch(verifyJWT, updateUserPassword);
router.route("/delete-account").delete(verifyJWT, deleteUserAccount);
router.route("/refresh-access-token").put(verifyJWT, refreshAccessToken);
router
    .route("/update-avatar-image")
    .patch(verifyJWT, upload.single("avatar"), updateAvatarImage);
router
    .route("/update-cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

export default router;
