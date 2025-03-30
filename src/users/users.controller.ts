import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(createUserDto.password, salt)
    createUserDto.password = hashedPassword
    return {
      message: "Created user",
      user: await this.usersService.register(createUserDto)
    }
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.usersService.login(loginUserDto.email, loginUserDto.password)
    return {
      message: "Logged in successfully!",
      ...tokens
    }
  }

  @Post("refresh-token")
  async refreshToken(@Body() reqBody: { refreshToken: string }) {
    const newToken = await this.usersService.refreshToken(reqBody.refreshToken)
    return {
      message: 'Refreshed token successfully!',
      accessToken: newToken
    }
  }
}
