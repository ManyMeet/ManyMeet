import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';

import {
  Module,
  // NestModule,
  OnModuleInit,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { CalendarModule } from './modules/calendar/calendar.module';
import { GoogleService } from './modules/google/google.service';
import { AuthMiddleware } from './auth.middleware';
import { HttpModule } from '@nestjs/axios';
import { GoogleController } from './modules/google/google.controller';
import { GoogleModule } from './modules/google/google.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({ entities: [User] }),
    UserModule,
    CalendarModule,
    HttpModule,
    GoogleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

// export class AppModule implements NestModule, OnModuleInit {
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    const migrator = await this.orm.getMigrator();
    await migrator.createMigration();
    await migrator.up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware, AuthMiddleware).forRoutes('*');
  }
}
