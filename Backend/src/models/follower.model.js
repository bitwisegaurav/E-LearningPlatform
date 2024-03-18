import { model, Schema } from "mongoose";

const followersSchema = new Schema(
    {
        FollowerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        FollowingId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

export const Followers = model("Followers", followersSchema);
