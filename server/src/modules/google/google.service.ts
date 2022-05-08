import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { getEventsDto } from './dto/getEventsDto';
import { OAuth2Client } from 'google-auth-library';


import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Participant } from '../../entities/participant.entity';
import { Event } from '../../entities/event.entity';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class GoogleService {

  private clientParams: string[];

  constructor(
    private readonly userRepository: UserRepository,
    
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,

    @InjectRepository(Participant)
    private readonly participantRepository: EntityRepository<Participant>,
  ) {
    this.clientParams = [
      process.env['GOOGLE_CLIENT_ID'],
      process.env['GOOGLE_CLIENT_SECRET'],
      process.env['GOOGLE_REDIRECT_URL']
    ]
  }

  getOrgAuthUrl(id:string) {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const oauth2Client = new google.auth.OAuth2(...this.clientParams);
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: id.toString()
    })

    return url;
  }

  getParticipantAuthUrl(id:string) {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const oauth2Client = new google.auth.OAuth2(...this.clientParams);
    const url = oauth2Client.generateAuthUrl({
      scope: scopes,
      state: id.toString()
    })

    return url;
  }


  async setOrgTokens(id:string, code: string) {
    const oauth2Client = new google.auth.OAuth2(...this.clientParams);
    const { tokens } = await oauth2Client.getToken(code);
    if (tokens) {
      const { refresh_token } = tokens;
      const user = await this.userRepository.findOne(id)
      if (user) {
        user.refresh_token = refresh_token;
        this.userRepository.persistAndFlush(user);
      }
    }
  }

  async authorize(id: string, org:boolean) {
    const oauth2Client = new google.auth.OAuth2(...this.clientParams );
    if (org) {
      const user = await this.userRepository.findOne(id);
      const refresh_token = user.refresh_token;
      oauth2Client.setCredentials({ refresh_token })
    } else {
      const participant = await this.participantRepository.findOne(id);
      const access_token = participant.access_token;
      oauth2Client.setCredentials({access_token})
    }
    return oauth2Client
  }

  async getEvents({auth, calendarId, timeMin, timeMax, maxResults, singleEvents, orderBy}: getEventsDto ) {
    const calendar = google.calendar({version: 'v3', auth});
    try {
      const res = await calendar.events.list({
        calendarId: calendarId || 'primary',
        timeMin: timeMin || (new Date()).toISOString(),
        timeMax,
        maxResults: maxResults || 10,
        singleEvents: singleEvents || true,
        orderBy: orderBy ||'startTime',  
      })

      const events = res.data.items.map(ev => {
        return {
          start: (ev.start.dateTime) || ev.start.date,
          end: ev.end.dateTime || ev.end.date,
          id: ev.id,
          color: {
            primary: '#74eb74',
            secondary: '#daf4da'
          }, 
          title: ev.summary,
          cssClass: 'GoogleEvent',
          meta: {
            calendarId: calendarId || 'primary',
            description: ev.description,
            editable: false,
            canBeDeleted: false,
            syncedEvent: true
          }
        }
      })
    
      return events;
      
    } catch (e){
      console.error(e)
      return []; // Maybe not the best?
    }
  }

  

  async getCalendars(auth: OAuth2Client) {
    const calendar = google.calendar({version: 'v3', auth});
    try {
      const res = await calendar.calendarList.list()
      
      const calendars = res.data.items.map(cal => {
        return {
          id: cal.id,
          summary: cal.summary,
          primary: cal.primary ? true : false
        }
      })
      
      return calendars

    } catch (e) {
      console.error(e);
      return [] // maybe not the best
    }
  }

  async getCalendar(auth: OAuth2Client, calendarId:string) {
    const calendar = google.calendar({version: 'v3', auth});
    try {
      const res = await calendar.calendarList.get({
        calendarId
      })
      return res.data;
    } catch (e) {
      console.error(e);
      return {}
    }
  }

}

