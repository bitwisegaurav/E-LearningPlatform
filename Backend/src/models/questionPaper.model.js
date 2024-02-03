import { model, Schema } from "mongoose";

const questionPaperSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        fileURL: {
            type: String, // url of the file
            required: true,
        },
        degree: {
            type: Schema.Types.ObjectId,
            ref: "Degree",
        },
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
        },
        year: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true },
);

export const QuestionPaper = model("QuestionPaper", questionPaperSchema);
