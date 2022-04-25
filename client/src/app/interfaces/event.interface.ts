export interface EventRO {
  id: string;
  title: string;
  start: string;
  end: string;
  provider?: string;
  client?: string;
  calendar: string;
  meta: string;
}

export interface EventDTO {
  id: string | number;
  title: string;
  start: string;
  end: string;
  provider?:string;
  client?: string;
  calendar: string;
  meta: string;
}



export interface EventProcessed {
  id: string;
  title: string;
  start: string;
  end: string;
  provider?: string;
  client?: string;
  calendar: string;
  meta: {[key:string]: any};
}