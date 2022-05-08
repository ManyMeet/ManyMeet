import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

import { Event } from 'src/entities/event.entity';
import { Participant } from 'src/entities/participant.entity';
import { Calendar } from '../calendar/calendar.entity';
import { User } from '../user/user.entity';





@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Calendar, User, Event, Participant] }),
    HttpModule
  ],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}