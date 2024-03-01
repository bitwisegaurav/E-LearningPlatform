import { model, Schema } from "mongoose";

const questionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        course: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        companies: [String],
        tags: [String],
    },
    { timestamps: true },
);

export const Question = model("Question", questionSchema);
