import mongoose, { Schema } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage: mongoose.Types.ObjectId;
}

const ChatSchema = new Schema<IChat>(
    {
        participants: [
            { type: Schema.Types.ObjectId, ref: "User", required: true },
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
    },
);

export const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);
