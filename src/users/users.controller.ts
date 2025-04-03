import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(createUserDto.password, salt)
    createUserDto.password = hashedPassword
    let userData = await this.usersService.register(createUserDto)
    const { password, ...returnData } = userData
    return {
      message: "Created user",
      user: returnData
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

  @UseGuards(AuthGuard)
  @Get('info')
  async getUserInfo(@Request() req: Request) {
    const userId = req['user']._id
    const userInfo = await this.usersService.getUserInfo(userId)
    return {
      message: 'Get user info',
      userInfo
    }
  }
}
