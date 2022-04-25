import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, UuidType } from "@mikro-orm/core";
import { User } from "../user/user.entity";
const uuid = require('uuid') 
import { Event } from "src/entitites/event.entity";
import { Participant } from "src/entitites/participant.entity";
import { CalendarRepository } from "./calender.repository";

@Entity({ customRepository: () => CalendarRepository})
export class Calendar {

  [EntityRepositoryType]?: CalendarRepository;

  @PrimaryKey()
  uuid: UuidType;
  
  @Property()
  title:string;
  
  @Property()
  start: Date;
  
  @Property()
  end: Date;

  @Property()
  minHour: string;

  @Property()
  maxHour: string;

  @ManyToMany(()=> User, user => user.calendars)
  users = new Collection<User>(this);

  @OneToMany(() => Event, event => event.calendar, {orphanRemoval:true})
  events = new Collection<Event>(this);

  @OneToMany(()=> Participant, participant => participant.calendar,  {orphanRemoval:true})
  participants = new Collection<Participant>(this);

  constructor (id: string , title:string , start:Date, end:Date) {
    this.uuid = id ? id : uuid.v4()
    this.title = title,
    this.start = start,
    this.end = end
  }

}