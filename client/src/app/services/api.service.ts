import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { of, Observable } from 'rxjs';
import { mocks } from 'src/mocks';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getCalendar (id:string | number) : Observable<CalendarData> {
      return of(mocks.calendars[id]);
  }

}


interface CalendarData {
  minDate?: Date;
  maxDate?: Date;
  minHour?: number;
  maxHour?: number;
  events: CalendarEvent[];
}