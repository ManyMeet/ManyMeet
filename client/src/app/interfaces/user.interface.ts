export interface UserRO {
  email: 'string';
  id: number;
  calendars: [{id:string, title:string}]
  ok:boolean; 
}