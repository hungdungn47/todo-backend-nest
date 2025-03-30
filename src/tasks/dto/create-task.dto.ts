import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
  dueDate: Date
}