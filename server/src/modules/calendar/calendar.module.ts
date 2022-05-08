import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

import { Calendar } from './calendar.entity';
import { Participant } from 'src/entities/participant.entity';
import { Event } from 'src/entities/event.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Calendar, Participant, Event] }),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
