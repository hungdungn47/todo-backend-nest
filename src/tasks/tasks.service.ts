import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel, ParseObjectIdPipe } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }

  async findAll(userId: string) {
    const tasks = await this.taskModel.find({
      user: userId
    })

    return tasks
  }

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const newTaskData = {
      user: new mongoose.Types.ObjectId(userId),
      ...createTaskDto
    }
    const createdTask = new this.taskModel(newTaskData)
    return createdTask.save()
  }

  async updateTask(taskId: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (!mongoose.isValidObjectId(taskId)) {
      throw new NotFoundException('Task ID is invalid')
    }
    const updatedTask = await this.taskModel.findOneAndUpdate({
      _id: taskId,
      user: userId
    }, updateTaskDto, { new: true })
    if (!updatedTask) {
      throw new NotFoundException('Task not found')
    }
    return updatedTask
  }

  async deleteTask(taskId: string, userId: string): Promise<Task> {
    if (!mongoose.isValidObjectId(taskId)) {
      throw new NotFoundException('Task ID is invalid')
    }
    const deletedTask = await this.taskModel.findOneAndDelete({
      _id: taskId,
      user: userId
    }, { new: true })
    if (!deletedTask) {
      throw new NotFoundException('Task not found')
    }
    return deletedTask
  }
}
