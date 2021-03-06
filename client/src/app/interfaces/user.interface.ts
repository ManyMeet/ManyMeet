import { calendarPreview as calendar } from "./calendar.interface";

export interface UserRO {
  email: 'string';
  id: number;
  calendars: calendar[]
  ok:boolean; 
}

export interface UserPreviewRO {
  id: number,
  email: string;
}