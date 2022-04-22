import { Injectable } from '@nestjs/common';
import { ICalendarRO } from './calendar.interface';
import { CalendarRepository } from './calender.repository';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Calendar  as CalendarEntity} from './calendar.entity';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Event } from 'src/entitites/event.entity';
import { Participant } from 'src/entitites/participant.entity';
import { UpdateEventDto } from './dto/update-event-dto';
import { UuidType } from '@mikro-orm/core';
import { UpdateParticipantDto } from './dto/update-participant-dto';
const uuid = require('uuid')

@Injectable()
export class CalendarService {
  
  constructor ( 
    private readonly calendarRepository: CalendarRepository,
    
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,

    @InjectRepository(Participant)
    private readonly participantRepository: EntityRepository<Participant>
    ) {}


  /**********************
   * Calendar functions *
   **********************/


  async create (dto: CreateCalendarDto, user: User) : Promise <ICalendarRO>{
    const {id, title} = dto;
    const start = new Date(dto.start);
    const end = new Date(dto.end);
    
    const exists = await this.calendarRepository.findOne({uuid:id});

    if (exists) {
      throw new HttpException({
        message: 'Input data validation failed',
        errors: {general: 'Calendar exists'},
      }, HttpStatus.BAD_REQUEST);
    }
    
    const calendar = new CalendarEntity(id, title, start, end);
    user.calendars.add(calendar)
    await this.calendarRepository.persistAndFlush(calendar)
    return this.buildCalendarRo(calendar)
  }
  
  async find(id:string) : Promise <ICalendarRO> {
    const exists = await this.calendarRepository.findOne({uuid: id}, {populate: ['users','events', 'participants']});
    if (!exists) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Calendar not found'},
      }, HttpStatus.NOT_FOUND);
    }

    return this.buildCalendarRo(exists);
  }

  async delete(id:string): Promise <{message:string, description:{'id':UuidType}}> {
    const exists = await this.calendarRepository.findOne({uuid: id}, {populate: ['users','events', 'participants']});
    if (!exists) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Calendar not found'},
      }, HttpStatus.NOT_FOUND);
    }
    this.calendarRepository.removeAndFlush(exists);
    return {message: 'deleted', description: {'id': exists.uuid}}
  }

  async update(id:string, dto: UpdateCalendarDto) {
    const cal = await this.calendarRepository.findOne({uuid:id}, {populate: ['events', 'users', 'participants']});
    if (!cal) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Calendar not found'}, 
      }, HttpStatus.NOT_FOUND)
    }
    
    if (dto.id) {
      cal.uuid = uuid.parse(dto.id);
    }

    if (dto.title) {
      cal.title = dto.title
    }

    if (dto.start) {
      cal.start = new Date(dto.start)
    }    

    if (dto.end) {
      cal.end = new Date(dto.end)
    }
    console.log('count outside', cal.events.count())

    if (dto.events && dto.events.length > 0) {
      await Promise.all( 
        dto.events.map(async ev => {
          const {id, title, start, end} = ev;
          let event = await this.eventRepository.findOne({id});
          if (event) {
            if (title) event.title = title;
            if (start) event.start = new Date(start);
            if (end) event.end = new Date(end);
            // add mentor??
            // add startup??
          } else {
            event = new Event(id, title, start, end);
            await cal.events.add(event);
          }
          await this.eventRepository.persistAndFlush(event);
        })
      )
    }

    if (dto.participants && dto.participants.length > 0) {
      await Promise.all( 
        dto.participants.map(async person => {
          const {id, type, name, email} = person;

          let participant = await this.participantRepository.findOne({id});
          
          if (!participant) {
            participant = await this.participantRepository.findOne({
              email: email, calendar: cal
            });
          }
          
          if (participant) {
            if (type) participant.type = type;
            if (name) participant.name = name;
            if (email) participant.email = email;
          } else {
            participant = new Participant(email, name, type)
            await cal.participants.add(participant)
          }
          await this.participantRepository.persistAndFlush(participant);
        })
      );
    }
    
    await this.calendarRepository.persistAndFlush(cal);
    
    return this.buildCalendarRo(cal)
    
  }

  /*******************
   * Event functions *
   *******************/

  async getEvents(id) {
    const events = await this.eventRepository.find({
     calendar: id
    })
    
    return this.buildEventsRo(events);

  }

  async getEvent(calendarId, eventId) {
    const event = await this.eventRepository.findOne({
     id: eventId
    })

    if (!event || event.calendar.uuid !== calendarId) {
      throw new HttpException({
        message: 'Resource not Found',
        errors: {general:'Event not found'}
      }, HttpStatus.NOT_FOUND)
    }

    return this.buildEventRo(event);
    
  }
  
  async deleteEvent(calendarId, eventId) {
    const event = await this.eventRepository.findOne({id:eventId, calendar: calendarId})
    await this.eventRepository.removeAndFlush(event);

    return this.buildEventRo(event);
  }
  

  async updateEvent(calendarId, eventId, dto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({id:eventId});
    
    if (!event || event.calendar.uuid !== calendarId) {
      throw new HttpException({
        message: 'Resource not found', 
        errors: {general: 'Event not found'}
      }, HttpStatus.NOT_FOUND)
    }

    const {title, start, end, clientId, providerId} = dto;
    if (title) event.title = title;
    if (start) event.start = new Date(start);
    if (end) event.end = new Date(end);
    if (clientId) {
      const client = await this.participantRepository.findOne({id:clientId})
      
      if (!client) {
        throw new HttpException({
          message: 'Bad Request', 
          errors: {general:"client doesn't exist"}
        }, HttpStatus.BAD_REQUEST)
      } 
      
      event.client = client;
      
    } 
    if (providerId) {
      const provider = await this.participantRepository.findOne({id:providerId})
      
      if (!provider) {
        throw new HttpException({
          message: 'Bad Request', 
          errors: {general:"provider doesn't exist"}
        }, HttpStatus.BAD_REQUEST)
      } 
      
      event.provider = provider;  
    } 
    
    await this.eventRepository.persistAndFlush(event)    
    
    return this.buildEventRo(event);
  }


  /*************************
   * Participant functions *
   *************************/
  async getParticipants(calendarId) {
    const participants = await this.participantRepository.find({calendar:calendarId}, {populate: ['events']});
    return this.buildParticipantsRo(participants)
  }

  async getParticipant(calendarId, participantId) {
    const participant = await this.participantRepository.findOne({
      id:participantId, calendar:calendarId
    }, {populate: ['events']});

    if (!participant) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Participant not found'}
      }, HttpStatus.NOT_FOUND)
    }

    return this.buildParticipantRo(participant)
  }

  async deleteParticipant(calendarId, participantId) {
    const participant = await this.participantRepository.findOne({id:participantId, calendar:calendarId});
    if (!participant) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Participant not found'}
      }, HttpStatus.NOT_FOUND)
    }

    await this.participantRepository.removeAndFlush(participant);
    return this.buildParticipantRo(participant);
  }

  async updateParticipant(calendarId, participantId, dto: UpdateParticipantDto) {
    const participant = await this.participantRepository.findOne({id:participantId, calendar:calendarId});
    
    if (!participant) {
      throw new HttpException({
        message: 'Resource not found',
        errors: {general: 'Participant not found'}
      }, HttpStatus.NOT_FOUND)
    }
    
    const {email, name} = dto;
    if (email) participant.email = email;
    if (name) participant.name = name;

    await this.participantRepository.persistAndFlush(participant);
    
    return this.buildParticipantRo(participant)
  }


  /******************************
   * Response object formatters *
   ******************************/

  private buildParticipantsRo(participants: Participant[]) {
    return participants.map(participant => {
      return {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        type: participant.type, 
        events: participant.events ? participant.events.toArray().map(ev => ev.id) : [] 
      }
    });      
  }

  private buildParticipantRo(participant: Participant) {
    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      type: participant.type, 
      events: participant.events ? participant.events.toArray().map(ev => ev.id) : [] 
    }
  }


  private buildEventRo(event: Event) {
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      provider: event.provider,
      client: event.client,
      calendar: event.calendar?.uuid ? event.calendar.uuid.toString() : event.calendar.toString()
    }
  }


  private buildEventsRo(events: Event[]) {
    return events.map(event => {
      return {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        provider: event.provider,
        client: event.client,
        calendar: event.calendar?.uuid ? event.calendar.uuid.toString() : event.calendar.toString()
      }
    })
  }

  private buildCalendarRo(calendar: CalendarEntity) {

    const eventsMap = calendar.events.toArray().map(ev => {
      return {
        title:ev.title,
        start: ev.start,
        end:ev.end, 
        id: ev.id,
        calendar: ev.calendar?.uuid ? ev.calendar.uuid.toString() : ev.calendar.toString(),
        provider: ev.provider,
        client: ev.client
      } 
    })

    const participantsMap = calendar.participants.toArray().map(p => {
      
      return {
        id: p.id.toString(),
        name: p.name, 
        email: p.email,
        type: p.type,
        calendar: p.calendar?.uuid ? p.calendar.uuid.toString() : p.calendar.toString(),
        events: p.events? p.events.map(e => e.id) : []
      }
    })

    const usersMap = calendar.users.toArray().map(u => {return {id: u.id, email: u.email}})

    const calendarRo = {
      id: calendar.uuid.toString(),
      title:calendar.title,
      start: calendar.start.toISOString(),
      end: calendar.end.toISOString(),
      events: eventsMap,
      participants: participantsMap,
      users: usersMap
    }
    
    return {calendar: calendarRo}

  }

}
