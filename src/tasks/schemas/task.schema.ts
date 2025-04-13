import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { TaskStatus } from "../enums/task.enum";

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop()
  description?: string

  @Prop()
  tags: [string]

  @Prop({ enum: TaskStatus, default: TaskStatus.NotStarted })
  status: string

  @Prop()
  dueDate: Date

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)