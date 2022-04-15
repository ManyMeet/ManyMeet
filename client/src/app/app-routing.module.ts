import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'auth/google', component: GoogleAuthComponent },
  {path:':calendarId', component:EventCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
