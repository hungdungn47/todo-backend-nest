import { Body, Controller, Get, UseGuards, Request, Post, Put, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/services/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(AuthGuard)
  @Get('')
  async findAll(@User('_id') userId: string) {
    const tasks = await this.tasksService.findAll(userId)
    return {
      message: "Get all tasks",
      tasks
    }
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createTask(@User('_id') userId: string, @Body() createTaskDto: CreateTaskDto) {
    const createdTask = await this.tasksService.createTask(userId, createTaskDto)
    return {
      message: "Created task",
      createdTask
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTask(@Param('id') id: string, @User('_id') userId: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.updateTask(id, userId, updateTaskDto)
    return {
      message: "Updated task",
      updatedTask
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @User('_id') userId: string) {
    const deletedTask = await this.tasksService.deleteTask(id, userId)
    return {
      message: "Deleted task",
      deletedTask
    }
  }
}
