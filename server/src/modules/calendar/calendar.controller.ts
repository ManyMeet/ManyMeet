import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User as ReqUser } from 'src/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { UpdateEventDto } from './dto/update-event-dto';
import { UpdateParticipantDto } from './dto/update-participant-dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /*******************
   * Calendar routes *
   *******************/

  @Post()
  async createCalendar(
    @ReqUser() user: User,
    @Body() calendarData: CreateCalendarDto,
  ) {
    const data = await this.calendarService.create(calendarData, user);
    return data.calendar;
  }

  @Get(':calendarId')
  async getCalendar(@Param('calendarId') id:string) {
    return this.calendarService.find(id);
  }

  @Delete(':calendarId')
  async deleteCalendar(@Param('calendarId') id:string) {
    return this.calendarService.delete(id);
  }

  @Post(':calendarId')
  async updateCalendar(
    @Param('calendarId') id:string,
    @Body() calendarData: UpdateCalendarDto,
  ) {
    return this.calendarService.update(id, calendarData);
  }

  /****************
   * Event routes *
   ****************/

  @Get(':calendarId/events')
  async getEvents(@Param('calendarId') id:string) {
    return this.calendarService.getEvents(id);
  }

  @Get(':calendarId/events/:eventId')
  async getEvent(@Param() params: {[key:string]:string}) {
    const { calendarId, eventId } = params;
    return this.calendarService.getEvent(calendarId, eventId);
  }

  @Post(':calendarId/events/:eventId')
  async updateEvent(@Param() params: {[key:string]:string}, @Body() eventData: UpdateEventDto) {
    const { calendarId, eventId } = params;
    return this.calendarService.updateEvent(
      calendarId,
      eventId,
      eventData,
    );
  }

  @Delete(':calendarId/events/:eventId')
  async deleteEvent(@Param() params: {[key:string]:string}) {
    const { calendarId, eventId } = params;
    return this.calendarService.deleteEvent(calendarId, eventId);
  }

  /**********************
   * Participant routes *
   **********************/

  @Get(':calendarId/participants')
  async getParticipants(@Param('calendarId') id:string) {
    return this.calendarService.getParticipants(id);
  }

  @Get(':calendarId/participants/:participantId')
  async getParticipant(@Param() params: {[key:string]:string}) {
    const { calendarId, participantId } = params;
    return this.calendarService.getParticipant(calendarId, participantId);
  }

  @Delete(':calendarId/participants/:participantId')
  async deleteParticipant(@Param() params: {[key:string]:string}) {
    const { calendarId, participantId } = params;
    return this.calendarService.deleteParticipant(calendarId, participantId);
  }

  @Post(':calendarId/participants/:participantId')
  async updateParticipant(
    @Param() params: {[key:string]:string},
    @Body() participantData: UpdateParticipantDto,
  ) {
    const { calendarId, participantId } = params;
    return this.calendarService.updateParticipant(
      calendarId,
      participantId,
      participantData,
    );
  }
}
