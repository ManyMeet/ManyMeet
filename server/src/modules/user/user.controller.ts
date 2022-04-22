import { Controller, Post, Get, Req, Body, Session } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) {}


  @Post('/register')
  async create(@Session() session: Record<string, any>, @Body() userData: CreateUserDto ) {
    const data = await this.userService.create(userData);
    if (data) session.userId = data.user.id;
    return data.user;
    // return this.userService.create(userData);
  }

  @Post('/login')
  async login(@Session() session: Record<string, any>, @Body() userData: CreateUserDto) {
    const data = await this.userService.login(userData);
    if (data) session.userId = data.user.id;

    return data.user;
  }

}
