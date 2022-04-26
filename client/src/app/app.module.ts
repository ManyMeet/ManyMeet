import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { CalendarModule, DateAdapter } from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
// import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { MaterialDesignModule } from 'src/material-design/material-design.module';
import { EventDetailsDialogComponent } from './components/event-details-dialog/event-details-dialog.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarMiniComponent } from './components/calendar-mini/calendar-mini.component';
import { CreateCalendarDialogComponent } from './components/create-calendar-dialog/create-calendar-dialog.component';
import { ParticipantsComponent } from './components/participants/participants.component';
import { ParticipantDialogComponent } from './components/participant-dialog/participant-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GoogleAuthComponent,
    EventDetailsDialogComponent,
    EventCalendarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    CalendarMiniComponent,
    CreateCalendarDialogComponent,
    ParticipantsComponent,
    ParticipantDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    BrowserAnimationsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MaterialDesignModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
