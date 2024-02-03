import { model, Schema } from "mongoose";

const moduleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: [
            {
                type: Schema.Types.ObjectId,
                ref: "Content",
            },
        ],
        assignments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Assignment",
            },
        ],
    },
    { timestamps: true },
);

export const Module = model("Module", moduleSchema);
