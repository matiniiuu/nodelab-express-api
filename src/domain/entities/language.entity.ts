import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { defaultSchemaOptions } from '@app/shared';

@Schema(defaultSchemaOptions())
export class Language extends Document {
    @Prop({ type: String, required: true }) name: string;

    @Prop({ type: String, required: true }) code: string;

    @Prop({ type: String, required: true }) image: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
