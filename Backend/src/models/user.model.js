import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        articleCount: {
            type: Number,
            default: 0,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String, // url of th e image
        },
        coverImage: {
            type: String, // url of the image
        },
        progress: {
            type: Object,
            default: {},
        },
        courses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        solvedQuestions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
    },
    { timestamps: true },
);

export const User = model("User", userSchema);
