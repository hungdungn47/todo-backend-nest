import { Body, Controller, Get, UseGuards, Request, Post, Put, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/users/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(AuthGuard)
  @Get('')
  async findAll(@Request() req: Request) {
    const tasks = await this.tasksService.findAll(req['user']._id as string)
    return {
      message: "Get all tasks",
      tasks
    }
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createTask(@Request() req: Request, @Body() createTaskDto: CreateTaskDto) {
    const userId = req['user']._id as string
    const createdTask = await this.tasksService.createTask(userId, createTaskDto)
    return {
      message: "Created task",
      createdTask
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTask(@Param('id') id: string, @Request() req: Request, @Body() updateTaskDto: UpdateTaskDto) {
    const userId = req['user']._id as string
    const updatedTask = await this.tasksService.updateTask(id, userId, updateTaskDto)
    return {
      message: "Updated task",
      updatedTask
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req: Request) {
    const userId = req['user']._id as string
    const deletedTask = await this.tasksService.deleteTask(id, userId)
    return {
      message: "Deleted task",
      deletedTask
    }
  }
}
