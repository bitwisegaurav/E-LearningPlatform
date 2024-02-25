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
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
router.route("/get-user").get(verifyJWT, getUserProfile);
router.route("/get-user/:username").get(getUserProfileByUsername);
router.route("/update-user").patch(verifyJWT, updateUserProfile);
router.route("/login-user").post(loginUser);
router.route("/logout-user").post(verifyJWT, logoutUser);
router.route("/update-user-password").patch(verifyJWT, updateUserPassword);
router.route("/delete-user-account").delete(verifyJWT, deleteUserAccount);
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken);

export default router;
