import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { colors } from './helpers/colors';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import {v4 as uuidv4 } from 'uuid';
const now = new Date();
const dog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0,0);
const dogEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0,0);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized');
  events: CalendarEvent[] = [
    {
      start: dog,
      end: dogEnd,
      title: 'A doggo event',
      color: colors['red'],
      meta: {
        canBeDeleted: false,
      },
      id: 'chiepa'
    }
  ]
  allowance: number = 10;
  created: number = 0;
  constructor (
    public eventDialog:MatDialog,
    private api: CalendarService,
    ) { }

  ngOnInit () : void {
  } 

  changeView(view: CalendarView) {
    this.view = view;
  }

  dayClicked(date:Date, events?:CalendarEvent[]) :void {
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
    this.api.authorize()
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
    this.api.getEvents(searchParams).subscribe(events => {
      for (let ev of events) {
        this.events = [
          ...this.events,
          {
            start: new Date(ev.start.dateTime) || new Date(ev.start.date), 
            end: new Date(ev.end.dateTime) || new Date(ev.end.date),
  

            title:ev.summary
          }
        ]
      }


    });
  }

}
