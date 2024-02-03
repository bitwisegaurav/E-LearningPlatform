import { model, Schema } from "mongoose";

const degreeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
    },
    { timestamps: true },
);

export const Degree = model("Degree", degreeSchema);
