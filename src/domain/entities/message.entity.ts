import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { defaultSchemaOptions } from '../helpers';
import { Chat } from './chat.entity';

@Schema(defaultSchemaOptions())
export class Message extends Document<string> {
    @Prop({ type: String, required: true }) from: string;
    @Prop({ type: String, required: true }) to: string;
    @Prop({ type: String, required: true }) content: string;
    @Prop({ type: Boolean, default: false }) isRead: boolean;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'Chat',
        required: true,
    })
    chatId?: string;
    chat?: Chat;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
