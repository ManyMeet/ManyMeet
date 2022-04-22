import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Calendar } from "src/modules/calendar/calendar.entity";
import { Participant } from "./participant.entity";


@Entity()
export class Event {
  @PrimaryKey()
  _id!: number;

  @Property()
  id!: string;

  @Property()
  start: Date;

  @Property()
  title: string;

  @Property()
  end: Date;

  @ManyToOne(()=> Calendar, 'events')
  calendar: Calendar;

  @ManyToOne(()=>Participant, 'events' )
  provider?: Participant;

  @ManyToOne(() => Participant, 'events')
  client?: Participant

  constructor (id:string, title: string, start: string, end: string) {
    this.id = id,
    this.start = new Date(start),
    this.end = new Date(end);
    this.title = title;
  }

}