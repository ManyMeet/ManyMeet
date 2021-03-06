import { Participant } from 'src/entities/participant.entity';

export class UpdateCalendarDto {
  readonly id?: string;

  readonly title?: string;

  readonly start?: string;

  readonly end?: string;

  readonly minHour?: string;

  readonly maxHour?: string;

  readonly defaultDuration?: number;

  readonly defaultTitle?: string;

  readonly defaultDescription?: string;

  readonly defaultLocation?: string;

  readonly events?: Event[];

  readonly participants?: Participant[];
}

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  meta: string;
}
