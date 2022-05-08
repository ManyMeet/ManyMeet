import { Controller, Get, Param, Query, Redirect, } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GoogleService } from './google.service';

const client = 'http://localhost:4200' // this should be figured out for prod

@Controller('google')
export class GoogleController {
  constructor( private google : GoogleService) {}

  @Get('/auth/url')
  getOrgAuthUrl(@User('id') id: string, @Query('org') org:boolean) {
    const url = org ? this.google.getOrgAuthUrl(id) : this.google.getParticipantAuthUrl(id);
    return {url: url};
  }

  @Get('/org/auth/redirect')
  @Redirect(`${client}/auth/google`)
  async getOrgAuthCredentials( @Query('state') id: string, @Query('code') code:string) {
    await this.google.setOrgTokens(id, code);
  }

  @Get('/events')
  async getEvents(@User('id') id: string, @Query('org') org:boolean) {
    const auth = await this.google.authorize(id, org);
    const events = await this.google.getEvents({auth})
    return events;
  }

  @Get('/calendars')
  async getCalendars(@User('id') id: string, @Query('org') org:boolean) {
    const client =  await this.google.authorize(id, org);
    const calendars = await this.google.getCalendars(client);
    return calendars
  }

  @Get('/calendars/:calendarId')
  async getCalendar(@User('id') id: string, @Query('org') org:boolean, @Param('calendarId') calendarId: string) {
    const client = await this.google.authorize(id, org);
    const calendar = await this.google.getCalendar(client, calendarId)
    return calendar;
  }
}