import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { defaultSchemaOptions } from '../helpers';

@Schema(defaultSchemaOptions())
export class AutoMessage extends Document<string> {
    @Prop({ required: true })
    senderId: string;

    @Prop({ required: true })
    receiverId: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    sendDate: Date;
}

export const AutoMessageSchema = SchemaFactory.createForClass(AutoMessage);
