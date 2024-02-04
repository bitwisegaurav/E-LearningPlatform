import Router from "express";

const router = Router();

router.route('/health').get((__, res) => {
    res.json({
        message: "Serving users data perfectly",
        status: 200
    })
})

export default router;