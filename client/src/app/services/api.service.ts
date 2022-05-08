import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { of, map, Observable, catchError } from 'rxjs';
import { mocks } from 'src/mocks';
import { calendarRO, createCalendarDTO, updateCalendarDTO } from '../interfaces/calendar.interface';
import { ErrorResponse } from '../interfaces/error.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = 'http://localhost:3000/api'

  constructor(
    private http: HttpClient,
    private auth: AuthService, 
    private router: Router
    ) { }

  getCalendar (id:string | number) : Observable<calendarRO> {
    const userToken = localStorage.getItem('userToken');
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${userToken}`
    }),
      withCredentials: true
    }
    
    return this.http.get<any>(`${this.BASE_URL}/calendar/${id}`, httpOptions)
    .pipe(
      catchError(err => {
        this.auth.logout()
        throw new Error(err);
      }),
      map(data => {
        if (data.ok === undefined) {
          return {
            ...data.calendar, 
            ok: true
          }
        }
        return data;
      })
    )      
  }

  createCalendar(CalendarData: createCalendarDTO) : Observable<any> {
    const userToken = localStorage.getItem('userToken');
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${userToken}`
    }),
      withCredentials: true
    }
    
    return this.http.post<any>(this.BASE_URL + '/calendar', CalendarData, httpOptions)
    .pipe(
      catchError(err => {
        console.log(err);
        return of ({
          ok: false,
          message: err.error.message,
          errors: err.error.errors
        })
      }), 
      map(data => {
        if (data.ok === undefined) {
          return {
            ...data, 
            ok: true
          }
        }
        return data;
      })
    )
  }

  updateCalendar(calendarData: updateCalendarDTO): Observable<any> {
    const userToken = localStorage.getItem('userToken');
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${userToken}`
    }),
      withCredentials: true
    }
    return this.http.post<any>(`${this.BASE_URL}/calendar/${calendarData.id}`, calendarData, httpOptions )
    .pipe(
      catchError(err => {
        console.log(err);
        return of({
          ok:false, 
          message: err.error.message,
          errors: err.error.errors
        })
      }),
      map(data => {
        if (data.ok === undefined) {
          data.ok = true;
          return data;
        }
        return data;
      }) 
    )
  }

  getGoogleOAuthUrl (org=false) {
    const userToken = localStorage.getItem('userToken');
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${userToken}`
    }),
      withCredentials: true
    }

    return this.http.get<any>(`${this.BASE_URL}/google/auth/url?org=${org}`, httpOptions)
    .pipe(
      map(data => { 
        return data.url ? data.url : ''
      })
    )
  }

  getExternalCalendars(org=false) {
    const userToken = localStorage.getItem('userToken');
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${userToken}`
    }),
      withCredentials: true
    }

    return this.http.get<any>(`${this.BASE_URL}/google/calendars?org=${org}`, httpOptions);
  }


}