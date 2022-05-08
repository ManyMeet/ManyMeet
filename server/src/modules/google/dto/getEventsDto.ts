import { OAuth2Client } from 'google-auth-library';

export interface getEventsDto {
  auth: OAuth2Client,
  calendarId?: string,
  timeMin?: string,
  timeMax?:string, 
  maxResults?: number,
  singleEvents?: true,
  orderBy?: 'startTime',
}