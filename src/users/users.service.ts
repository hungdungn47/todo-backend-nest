import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync } from 'bcrypt-ts';
import { JwtService } from '../services/jwt.service'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly jwtService: JwtService) { }

  async register(createUserDto: CreateUserDto): Promise<User> {

    const checkUser = await this.userModel.findOne({
      email: createUserDto.email
    })
    if (checkUser) {
      throw new BadRequestException('This user has already been registered!')
    }

    const createdUser = await this.userModel.create(createUserDto)
    return createdUser.toObject();
  }

  async login(email: string, password: string): Promise<any> {
    const checkUser = await this.userModel.findOne({
      email: email
    })
    if (!checkUser) {
      throw new NotFoundException('This email has not been registered!')
    }

    const correctPassword = compareSync(password, checkUser.password)
    if (!correctPassword) {
      throw new BadRequestException('Incorrect password!')
    }

    const accessToken = this.jwtService.generateAccessToken({ email: checkUser.email, _id: checkUser._id })
    const refreshToken = this.jwtService.generateRefreshToken({ email: checkUser.email, _id: checkUser._id })

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(refreshToken: string): Promise<string> {
    return await this.jwtService.refreshToken(refreshToken)
  }

  async getUserInfo(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const { password, ...otherInfo } = user.toObject()
    return otherInfo
  }
}
