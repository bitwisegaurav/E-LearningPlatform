import { model, Schema } from "mongoose";

const contentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        module: {
            type: Schema.Types.ObjectId,
            ref: "Module",
        },
    },
    { timestamps: true },
);

export const Content = model("Content", contentSchema);
