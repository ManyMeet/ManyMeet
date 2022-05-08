export interface ICalendarData {
  title: string;
  id: string;
  start: string;
  end: string;

  minHour: string | null;
  maxHour: string | null;

  participants: ParticipantInterface[];
  events: EventInterface[];
}

export interface ICalendarRO {
  calendar: ICalendarData;
}

interface EventInterface {
  start: Date;
  end: Date;
  title: string;
  id: string;
  calendar: string;
}

interface ParticipantInterface {
  name: string;
  email: string;
  type: string;
  id: string;
  calendar: string;
  message: string;
  subject: string;
  emailSent: boolean;
}
