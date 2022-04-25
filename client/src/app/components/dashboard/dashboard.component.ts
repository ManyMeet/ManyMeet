import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ca, el } from 'date-fns/locale';
import { calendarPreview, createCalendarDTO } from 'src/app/interfaces/calendar.interface';
import { ErrorResponse } from 'src/app/interfaces/error.interface';
import { UserRO } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api.service';
import { CreateCalendarDialogComponent } from '../create-calendar-dialog/create-calendar-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  calendars: UserRO['calendars'] = [];
  pastCalendars: UserRO['calendars'] = [];

  constructor(
    private router:Router,
    private dialog: MatDialog,
    private calendarService : ApiService
    ) {
      if (this.router.getCurrentNavigation()?.extras) {
        let state = this.router.getCurrentNavigation()?.extras.state;
        if (state && state['calendars']){ 
          const calendars =  state['calendars']
          localStorage.setItem('calendars', JSON.stringify(calendars))
          this.populateCals(calendars)
        } 
      }
      if (!this.calendars.length && !this.pastCalendars.length) {
        const calendars = localStorage.getItem('calendars');
        if (calendars) {
          this.populateCals(JSON.parse(calendars))
        }
      }
    }

  ngOnInit(): void {

  }

  openCal(cal: calendarPreview) {
    this.router.navigate([cal.id])

  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = '#title';
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;

    // this.dialog.open(CreateCalendarDialogComponent, dialogConfig)
    const dialogRef = this.dialog.open(CreateCalendarDialogComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(
      (calData: createCalendarDTO ) => {
        this.calendarService.createCalendar(calData).subscribe( data => { 
          if (data.ok) {

            const updatedCalendars = [
              {
                title: data.title,
                id: data.id,
                start: data.start,
                end: data.end
              },
              ...this.calendars, 
              ...this.pastCalendars,
            ]

            this.populateCals(updatedCalendars)

            localStorage.setItem('calendars', JSON.stringify(updatedCalendars))
          }
        })
      }
    );
  }

  sort(calendars: calendarPreview[]) {
    return calendars.sort((a, b) => {
      if (a.start && b.start) {
        const d1 = new Date(Date.parse(a.start)).getTime()
        const d2 = new Date(Date.parse(b.start)).getTime()
        return d1 - d2
      }
      return 0;
    })
  }

  populateCals (calendars: calendarPreview[]) {
    const today = new Date();
    const pastCalendars : calendarPreview[] = [];
    const futureCalendars: calendarPreview[] = [];

    calendars.forEach(cal =>  {
      if (cal.start) {
        if (new Date(Date.parse(cal.start))  > today) {
          futureCalendars.push(cal)
        } else {
          pastCalendars.push(cal);
        }
      }
    })

    this.calendars = this.sort(futureCalendars);
    this.pastCalendars = this.sort(pastCalendars)
  }

}
