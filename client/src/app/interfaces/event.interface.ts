export interface EventRO {
  id: string;
  title: string;
  start: string;
  end: string;
  provider: string | null;
  client: string | null;
  calendar: string;
}

export interface EventDTO {
  id: string;
  title: string;
  start: string;
  end: string;
  provider?:string;
  client?: string;
  calendar: string;
}