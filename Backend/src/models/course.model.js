import { model, Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        modules: [
            {
                type: Schema.Types.ObjectId,
                ref: "Module",
            },
        ],
    },
    { timestamps: true },
);

export const Course = model("Course", courseSchema);
