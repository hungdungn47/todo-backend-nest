import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(['Not started', 'In progress', 'Done'])
  @IsOptional()
  status: string
}