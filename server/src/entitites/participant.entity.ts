import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, UuidType } from "@mikro-orm/core";
import { IsEmail } from "class-validator";
import { Calendar } from "src/modules/calendar/calendar.entity";
import { Event } from "./event.entity";

const uuid = require('uuid');

@Entity()
export class Participant {
  @PrimaryKey()
  id: UuidType;
  
  @Property()
  @IsEmail()
  email: string;
  
  @Enum(() => ParticipantType)
  type!: ParticipantType;

  @Property()
  name: string;

  @ManyToOne()
  calendar: Calendar

  @OneToMany(() => Event, event => event.provider || event.client)
  events = new Collection<Event>(this)

  constructor (email:string, name:string, type:ParticipantType) {
    this.email = email;
    this.type = type;
    this.name = name;
    this.id = uuid.v4();
  }

}


export enum ParticipantType {
  CLIENT = 'client',
  PROVIDER = 'provider'
}