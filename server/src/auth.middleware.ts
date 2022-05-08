import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { NextFunction } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
      const user = await this.userService.findOne({id:decoded.id});
      req.user = user;
      req.user.id = decoded.id;
      next();
    } else {
      next();
    }
  }
}