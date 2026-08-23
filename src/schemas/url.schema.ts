import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from './project.schema';

export type UrlDocument = HydratedDocument<Url>;

@Schema({
  timestamps: true,
})
export class Url {
  @Prop({
    required: true,
    index: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Project.name,
  })
  project: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ type: Date, expires: '30d' })
  expiresAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
