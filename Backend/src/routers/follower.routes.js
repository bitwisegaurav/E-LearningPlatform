import { verifyUser } from "../middlewares/auth.middleware.js";
import { followUser, isFollowing, unFollowUser } from "../controllers/follower.controller.js";

const router = Router();

router.route("/health").get((__, res) => {
    res.json({
        message: "Serving courses data perfectly",
        status: 200,
    });
});

router.route('/follow/:userId').post(verifyUser, followUser);
router.route('/isFollowing/:userId').get(verifyUser, isFollowing);
router.route('/unfollow/:userId').post(verifyUser, unFollowUser);

export default router;
