import mongoose, { Schema } from "mongoose";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_ATLAS_URL}/${process.env.DB_NAME}`);
        console.log("Database connected successfully. DB host : ", connectionInstance);
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
}