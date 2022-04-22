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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GoogleAuthComponent,
    EventDetailsDialogComponent,
    EventCalendarComponent,
    RegisterComponent,
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
