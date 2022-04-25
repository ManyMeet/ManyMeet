import { EventRO } from "./event.interface";
import { participantRO } from "./participant.interface";
import { UserPreviewRO } from "./user.interface";

export interface calendarPreview {
  id?:string, 
  title?:string, 
  start?: string, 
  end?: string
}

export interface calendarRO {
  id: string;
  title: string;
  start: string;
  minHour: string;
  maxHour:string;
  end: string;
  events: EventRO[];
  participants: participantRO[],
  users: UserPreviewRO[]
}


export interface createCalendarDTO {
  id?: string;
  title:string;
  start:string;
  end: string;
}

export interface updateCalendarDTO {
  id: string;
  title?: string;
  start?: string;
  end?: string;
  minHour?: string;
  maxHour?: string;
}
