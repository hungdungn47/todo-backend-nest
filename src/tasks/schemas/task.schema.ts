import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Task {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop()
  description?: string

  @Prop()
  tags: [string]

  @Prop({ default: 'Not started' })
  status: string

  @Prop()
  dueDate: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)