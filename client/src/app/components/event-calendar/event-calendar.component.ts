import {v4 as uuidv4 } from 'uuid';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { GoogleService } from 'src/app/services/google/google.service';
import { ApiService } from 'src/app/services/api/api.service';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { colors } from './helpers/colors';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendarComponent implements OnInit {
  // get calendar details from server

  viewDate: Date = new Date();
  minDate?: Date; 
  maxDate?: Date;
  minHour?: number;
  maxHour?: number;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized');
  events: CalendarEvent[] = [];

  
  allowance: number = 10;
  created: number = 0;

  constructor (
    public eventDialog:MatDialog,
    private googleService: GoogleService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit () : void {
    const id = this.route.snapshot.paramMap.get('calendarId');
    if (id) {
      this.apiService.getCalendar(id).subscribe(calendar => {
        if (calendar.minDate) this.viewDate = calendar.minDate;
        this.maxDate = calendar.maxDate;
        this.minDate = calendar.minDate;
        this.maxHour = calendar.maxHour;
        this.minHour = calendar.minHour;
        this.events = calendar.events;
      })
    }
  } 

  dateIsValid(date: Date): boolean {
    let validDate: boolean = true;
    let validHour: boolean = true;
    if (this.minDate && this.maxDate) {
      validDate = date >= this.minDate && date <= this.maxDate;
    }
    if (this.minHour && this.maxHour) {
      validHour = date.getHours() >= this.minHour && date.getHours() <= this.maxHour;
    }

    return validDate && validHour;
  }


  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      let validDate: boolean = true;
      if (this.minDate && this.maxDate) {
        validDate = day.date >= this.minDate && day.date <= this.maxDate;
      }
      if (!validDate) {
        day.cssClass = 'cal-disabled';
      }
    });
  }


  changeView(view: CalendarView) {
    this.view = view;
  }

  dayClicked(date:Date, events?:CalendarEvent[]) :void {
    if (!this.dateIsValid(date)) return;
    if (this.created < this.allowance) {
      const newEvent: CalendarEvent = {
        start:date,
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()+45),
        title: 'New Event',
        id: uuidv4(),
        meta: {
          canBeDeleted: true
        }
      }
      this.events = [
        ...this.events,
        newEvent
      ]
      this.created++;
    }
  }

  eventClicked({ event }: { event: CalendarEvent }): void {

    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = event;
    dialogConfig.minHeight = 400;
    dialogConfig.minWidth=400;
    dialogConfig.autoFocus=true;

    
    const dialogRef = this.eventDialog.open(EventDetailsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (!data) return;
      
      if (data.action === 'delete') {
        this.events = this.events.filter(ev => ev.id !== data.event.id);
      };

      if (data.action === 'save') {
        const ev = this.events.find(ev => ev.id === data.event.id);
        if (ev) ev.title = data.event.title;
        this.events = [...this.events];
      }

    })
    
  }

  clickedDate: Date | undefined = undefined;
  clickedColumn: number | undefined= undefined;

  google (): void {
    this.googleService.authorize()
  }
  
  getEvents() : void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    const searchParams : {[key:string]: string} = {
      timeMin:startDate,
      timeMax:lastDate,
      orderBy: 'startTime',
      singleEvents:'True'
    }
    this.googleService.getEvents(searchParams).subscribe(events => {
      for (let ev of events) {
        this.events = [
          ...this.events,
          {
            start: new Date(ev.start.dateTime) || new Date(ev.start.date), 
            end: new Date(ev.end.dateTime) || new Date(ev.end.date),
            id: ev.id,
            color:colors['green'],
  
            title:ev.summary
          }
        ]
      }

    });
  }

}
