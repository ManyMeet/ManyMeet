import { UuidType } from "@mikro-orm/core";
// import { Event } from "src/entitites/event.entity";
// import { Participant } from "src/entitites/participant.entity";

export interface ICalendarData {
  title: string;
  id: string;
  start: string;
  end: string;

  participants:ParticipantInterface[],
  events: EventInterface[]

}

export interface ICalendarRO {
  calendar: ICalendarData
}



interface EventInterface {
  start: Date,
  end: Date, 
  title: String;
  id: string,
  calendar: string
}

interface ParticipantInterface {
  name: string;
  email: string,
  type: string,
  id: string,
  calendar: string
}