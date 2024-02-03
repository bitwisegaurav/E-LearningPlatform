import { model, Schema } from "mongoose";

const questionSchema = new Schema(
    {
        content: {
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
    },
    { timestamps: true },
);

export const Question = model("Question", questionSchema);
