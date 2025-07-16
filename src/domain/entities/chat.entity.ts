import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { defaultSchemaOptions } from '../helpers';

@Schema(defaultSchemaOptions())
export class Chat extends Document<string> {
    @Prop({ type: String, required: true }) from: string;
    @Prop({ type: String, required: true }) to: string;
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'Message',
        required: true,
    })
    lastMessageId?: string;
    lastMessage?: Chat;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
