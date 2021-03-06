import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
const uuid = require('uuid');
import { Event } from '../../entities/event.entity';
import { Participant } from '../../entities/participant.entity';
import { CalendarRepository } from './calender.repository';

@Entity({ customRepository: () => CalendarRepository })
export class Calendar {
  [EntityRepositoryType]?: CalendarRepository;

  @PrimaryKey()
  uuid: UuidType;

  @Property()
  title: string;

  @Property()
  start: Date;

  @Property()
  end: Date;

  @Property()
  minHour: string;

  @Property()
  maxHour: string;

  @Property({ nullable: true })
  defaultTitle: string;

  @Property({ nullable: true })
  defaultDuration: number;

  @Property({ nullable: true })
  defaultLocation: string;

  @Property({ nullable: true })
  defaultDescription: string;

  @ManyToMany(() => User, (user) => user.calendars)
  users = new Collection<User>(this);

  @OneToMany(() => Event, (event) => event.calendar, { orphanRemoval: true })
  events = new Collection<Event>(this);

  @OneToMany(() => Participant, (participant) => participant.calendar, {
    orphanRemoval: true,
  })
  participants = new Collection<Participant>(this);

  constructor(id: string, title: string, start: Date, end: Date) {
    this.uuid = id ? id : uuid.v4();
    this.title = title;
    this.start = start;
    this.end = end;
    this.minHour = '00:00';
    this.maxHour = '23:59';
    this.defaultDuration = 30;
    this.defaultTitle = 'Open slot';
    this.defaultDescription = '';
    this.defaultLocation = '';
  }
}
