import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  @IsArray()
  tags: [string]

  @IsOptional()
  @IsDate({ message: "dueDate must be date instance with form yyyy/MM/dd" })
  @Type(() => Date)
  dueDate: Date
}