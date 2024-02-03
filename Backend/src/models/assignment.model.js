import { model, Schema } from "mongoose";

const assignmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
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

export const Assignment = model("Assignment", assignmentSchema);
