import mongoose, { Document, Schema } from "mongoose";

export interface IAutoMessage extends Document<string> {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;
    sendDate: Date;
    isQueued: boolean;
    isSent: boolean;
}

const AutoMessageSchema = new Schema<IAutoMessage>(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        sendDate: { type: Date, required: true },
        isQueued: { type: Boolean, default: false },
        isSent: { type: Boolean, default: false },
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

export const AutoMessage = mongoose.model<IAutoMessage>(
    "AutoMessage",
    AutoMessageSchema,
);
