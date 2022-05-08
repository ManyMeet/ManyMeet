import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, of, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private calendarUrl = 'https://www.googleapis.com/calendar/v3'
  private AuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?include_granted_scopes=true&response_type=token&state=34&redirect_uri=${'http://localhost:4200/auth/google/'}&scope=${environment.GOOGLE_SCOPES.join(' ')}&client_id=${environment.googleId}`
  
  
  constructor( private http: HttpClient) { }

  authorize(next?: Function) {
    if (next) next()
    else window.location.href = this.AuthUrl;
  }

  getEvents(query?: {[key:string] : string}): Observable <eventResource[]> {
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('access-token')})
    }

    let searchParams = new URLSearchParams(query).toString();
    if (searchParams !== '') searchParams = '?' + searchParams;
    return this.http.get<{status:number, items:eventResource[]}>(`${this.calendarUrl}/calendars/primary/events${searchParams}`, httpOptions)
    .pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.removeItem('authorized');
          localStorage.removeItem('access-token');
          this.authorize();
        }
        return of()
      }),
      map(data => {
        const events : eventResource[] = [];
        for (let ev of data.items){
          events.push(this.parseEvent(ev));
        }
        return this.sortEvents(events);
      })
    )
  }

  parseEvent(data: eventResource) : eventResource {
    return {
      id: data.id,
      status: data.status,
      created: data.created,
      summary: data.summary,
      description: data.description,
      start: data.start,
      end: data.end,
      attendees: data.attendees
    }
  }

  sortEvents(events: eventResource[]) {
    return events.sort((a,b) => {
      let first:number;
      let second: number;
      
      if (a.start.date) first = new Date(a.start.date).getTime();
      else first = new Date(a.start.dateTime).getTime();
      
      if (b.start.date) second = new Date(b.start.date).getTime();
      else second = new Date(b.start.dateTime).getTime();
      
      return first - second;

    })
  }

}







type eventResource = {
  "id": string,
  "status": string,
  "created": string,
  "summary": string,
  "description": string,
  "start": {
    "date": string,
    "dateTime": string,
    "timeZone": string
  },
  "end": {
    "date": string,
    "dateTime": string,
    "timeZone": string
  },
  "attendees": [
    {
      "id": string,
      "email": string,
      "displayName": string,
      "organizer": boolean,
      "self": boolean,
      "resource": boolean,
      "optional": boolean,
      "responseStatus": string,
      "comment": string,
    }
  ],
}
