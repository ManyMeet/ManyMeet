import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, map, of } from 'rxjs';
import { ErrorResponse } from '../interfaces/error.interface';
import { UserRO } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL = 'http://localhost:3000/api/'
  
  constructor( private http: HttpClient) { }



  register (email:string, password:string) : Observable<any> {
    const body = JSON.stringify({email, password});
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Credentials': 'include'
    })

    return this.http
      .post<any>(this.BASE_URL + 'users/register', body, {headers:httpOptions})
      .pipe(
        catchError(res => {
          console.error(res)
          const data: ErrorResponse = {
            ok: false, 
            errors: res.error.errors,
            message: res.error.message
          }
          return of(data)
        }),
        map((data: UserRO) => {
          if (data.ok === undefined) data.ok = true;
          return data;
        })
      )
  }

}
