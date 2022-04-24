import { EventRO } from "./event.interface";

export interface participantRO {
  id: string;
  name: string;
  email: string;
  type: 'provider' | 'client';
  calendar: string;
  // events: EventRO[]
}


