import { model, Schema } from "mongoose";

const solutionPaperSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        fileURL: {
            type: String, // url of the pdf file
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
        },
        description: {
            type: String,
        },
    },
    { timestamps: true },
);

export const SolutionPaper = model("SolutionPaper", solutionPaperSchema);
