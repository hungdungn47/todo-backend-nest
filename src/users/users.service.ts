import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt-ts';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async register(createUserDto: CreateUserDto): Promise<any> {
    const salt = genSaltSync(10)
    const hashedPassword = hashSync(createUserDto.password, salt)
    createUserDto.password = hashedPassword


    const createdUser = new this.userModel(createUserDto)
    return createdUser.save();
  }
}
