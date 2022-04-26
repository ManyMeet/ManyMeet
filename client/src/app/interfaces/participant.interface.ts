import { EventRO } from "./event.interface";

export interface participantRO {
  id: string;
  name: string;
  email: string;
  type: 'provider' | 'client';
  calendar: string;
  emailSent: boolean;
  subject: string;
  message: string;
  booked: boolean;
  description: string;
  events?: EventRO[]
}


