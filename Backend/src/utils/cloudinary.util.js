import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;
    try {
        const cloudinaryUploadValue = await cloudinary.uploader.upload(
            localFilePath,
            { resource_type: "auto" },
        );
        fs.unlinkSync(localFilePath);
        return cloudinaryUploadValue;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
};

const deleteCloudinary = async (publicIds) => {
    try {
        await cloudinary.uploader.destroy(publicIds);
        return true;
    } catch (error) {
        return false;
    }
};

export { uploadCloudinary, deleteCloudinary };