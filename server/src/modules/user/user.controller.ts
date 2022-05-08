import { Controller, Post, Body, Session } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(
    @Body() userData: CreateUserDto,
  ) {
    const data = await this.userService.create(userData);
    return data.user;
  }

  @Post('/login')
  async login(
    @Body() userData: CreateUserDto,
  ) {
    const data = await this.userService.login(userData);
    return data.user;
  }
}
