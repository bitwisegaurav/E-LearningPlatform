import { model, Schema } from "mongoose";

const interviewQuestionSchema = new Schema(
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

export const InterviewQuestion = model(
    "InterviewQuestion",
    interviewQuestionSchema,
);
