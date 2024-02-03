import { model, Schema } from "mongoose";

const roadmapSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
    },
    { timestamps: true },
);

export const Roadmap = model("Roadmap", roadmapSchema);
