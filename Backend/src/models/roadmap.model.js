import { model, Schema } from "mongoose";

const roadmapSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const Roadmap = model("Roadmap", roadmapSchema);
