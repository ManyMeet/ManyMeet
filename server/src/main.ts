import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';



async function bootstrap() {
  const appOptions = {
    cors: { 
      origin:'http://localhost:4200', 
      credentials:true,
    }
  }; 
  const app = await NestFactory.create(AppModule, appOptions);
  // const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); 
  app.use(session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true
    }),
    secret: process.env.SECRET_KEY || 'super secure key',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }, 
    saveUninitialized: false,
    resave: false,
    secure: process.env.PRODUCTION ? true : false,
    httpOnly: true
  }))

  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap().catch(err => console.log(err));
