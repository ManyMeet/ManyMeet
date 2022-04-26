import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, UuidType } from "@mikro-orm/core";
import { IsEmail } from "class-validator";
import { Calendar } from "src/modules/calendar/calendar.entity";
import { Event } from "./event.entity";

const uuid = require('uuid');

@Entity()
export class Participant {
  @PrimaryKey()
  id: string;
  
  @Property()
  @IsEmail()
  email: string;
  
  @Enum(() => ParticipantType)
  type!: ParticipantType;

  @Property()
  name: string;

  @Property({nullable:true})
  description: string;

  @Property()
  subject: string;

  @Property()
  message: string;

  @Property()
  emailSent: boolean;

  @ManyToOne()
  calendar: Calendar

  @OneToMany(() => Event, event => event.provider || event.client)
  events = new Collection<Event>(this)

  constructor (data) {
    const {id, name, email, description, type, subject, message, emailSent} = data;
  
    this.id = id;
    this.name = name;
    this.email = email;
    this.description = description;
    this.type = type;
    this.subject = subject;
    this.message = message;
    this.emailSent = emailSent
  }

}


export enum ParticipantType {
  CLIENT = 'client',
  PROVIDER = 'provider'
}