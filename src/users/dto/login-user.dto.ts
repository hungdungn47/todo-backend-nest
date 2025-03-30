import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string


  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string
}
