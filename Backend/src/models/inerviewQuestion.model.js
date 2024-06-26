import { model, Schema } from "mongoose";

const interviewQuestionSchema = new Schema(
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
            type: String
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

export const InterviewQuestion = model(
    "InterviewQuestion",
    interviewQuestionSchema,
);
