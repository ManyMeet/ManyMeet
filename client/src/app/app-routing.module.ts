import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ParticipantCalendarComponent } from './components/participant-calendar/participant-calendar.component';
import { ParticipantsComponent } from './components/participants/participants.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'old', component: HomeComponent},
  {path:'auth/google', component: GoogleAuthComponent },
  {path:'auth/google/participants', component: GoogleAuthComponent },
  {path:'auth/register', component:RegisterComponent},
  {path:'auth/login', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:':calendarId', component:EventCalendarComponent },
  {path:':calendarId/participants', component:ParticipantsComponent },
  {path:':calendarId/:participantId', component:ParticipantCalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
