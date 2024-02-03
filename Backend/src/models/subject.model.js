import { model, Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        years: [Number],
    },
    { timestamps: true },
);

export const Subject = model("Subject", subjectSchema);
