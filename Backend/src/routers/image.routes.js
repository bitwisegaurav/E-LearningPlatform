import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadImageHandler } from "../controllers/image.controller.js";


const router = Router()

router.route('/upload-image').post(verifyUser, upload.single('image'), uploadImageHandler)

export default router;