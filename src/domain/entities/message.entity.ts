import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document<string> {
    from: string;
    to: string;
    content: string;
    isRead: boolean;
    chat: mongoose.Types.ObjectId;
}

const MessageSchema = new Schema<IMessage>(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
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

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
