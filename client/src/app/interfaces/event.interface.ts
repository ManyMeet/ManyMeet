export interface EventRO {
  id: string;
  title: string;
  start: string;
  end: string;
  provider: string | null;
  client: string | null;
  calendar: string;
}

