import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from './modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (private userService: UserService) {}
  
  async use(req: any, res: any, next: () => void) {
    if (!(req.session && req.session.userId)) {
      return next();
    }
    
    const user = await this.userService.findOne({id : req.session.userId})
    if (!user) return next()
    req.user = user;
    next();
  }
}

