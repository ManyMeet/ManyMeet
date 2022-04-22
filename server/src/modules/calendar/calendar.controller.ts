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
  constructor (
    private readonly calendarService: CalendarService,
  ) {}


  /*******************
   * Calendar routes *
   *******************/

  @Post()
  async createCalendar(
    @ReqUser() user: User, 
    @Body() calendarData: CreateCalendarDto
  ) {

    const data = await this.calendarService.create(calendarData, user);
    return data.calendar;
  }

  @Get(':calendarId')
  async getCalendar (@Param('calendarId') id) {
    return this.calendarService.find(id)
  }

  @Delete(':calendarId')
  async deleteCalendar (@Param('calendarId') id) {
    return this.calendarService.delete(id)
  }

  @Post(':calendarId')
  async updateCalendar(@Param('calendarId') id, @Body() calendarData: UpdateCalendarDto) {
    return this.calendarService.update(id, calendarData)
  }

  /****************
   * Event routes *
   ****************/

  @Get(':calendarId/events')
  async getEvents(@Param('calendarId') id) {
    return this.calendarService.getEvents(id)
  }

  @Get(':calendarId/events/:eventId')
  async getEvent(@Param() params) {
    return this.calendarService.getEvent(params.calendarId, params.eventId)
  } 

  @Post(':calendarId/events/:eventId')
  async updateEvent(@Param() params, @Body() eventData: UpdateEventDto) {
    return this.calendarService.updateEvent(params.calendarId, params.eventId, eventData)
  }

  @Delete(':calendarId/events/:eventId')
  async deleteEvent(@Param() params) {
    return this.calendarService.deleteEvent(params.calendarId, params.eventId)
  }


  /**********************
   * Participant routes *
   **********************/

  @Get(':calendarId/participants')
  async getParticipants(@Param('calendarId') id) {
    return this.calendarService.getParticipants(id);
  }

  @Get(':calendarId/participants/:participantId')
  async getParticipant(@Param() params) {
    const {calendarId, participantId} = params;
    return this.calendarService.getParticipant(calendarId, participantId);
  }

  @Delete(':calendarId/participants/:participantId')
  async deleteParticipant(@Param() params) {
    const {calendarId, participantId} = params;
    return this.calendarService.deleteParticipant(calendarId, participantId);
  }

  @Post(':calendarId/participants/:participantId')
  async updateParticipant(@Param() params, @Body() participantData: UpdateParticipantDto) {
    const {calendarId, participantId} = params;
    return this.calendarService.updateParticipant(calendarId, participantId, participantData);
  }

}
