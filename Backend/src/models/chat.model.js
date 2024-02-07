import { model, Schema } from "mongoose";

const chatSchema = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        time: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

export const Chat = model("Chat", chatSchema);
