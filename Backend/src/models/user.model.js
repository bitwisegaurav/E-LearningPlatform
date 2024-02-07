import { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

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
            type: Schema.Types.Mixed,
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

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = model("User", userSchema);
