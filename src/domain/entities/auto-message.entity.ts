import mongoose, { Schema } from "mongoose";

export interface IAutoMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;
    sendDate: Date;
}

const AutoMessageSchema = new Schema<IAutoMessage>(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        sendDate: { type: Date, required: true },
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

export const AutoMessageModel = mongoose.model<IAutoMessage>(
    "AutoMessage",
    AutoMessageSchema,
);
