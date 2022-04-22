import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";


@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({entities:[User]})],
  providers: [UserService],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}