import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../enums/task.enum";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatus, {
    message: `Status must be one of ${Object.values(TaskStatus).join(', ')}`
  })
  @IsOptional()
  status: string
}