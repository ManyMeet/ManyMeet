import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { colors } from './helpers/colors';

import { MatDialog } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { compileDeclarePipeFromMetadata } from '@angular/compiler';


const now = new Date();
const dog = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0,0);
const dogEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0,0);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ '../../../../node_modules/angular-calendar/css/angular-calendar.css', './home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized') ;
  events: CalendarEvent[] = [
    {
      start: dog,
      end: dogEnd,
      title: 'A doggo event',
      color: colors['red'],
      meta: {
        canBeDeleted: true,
      }
      // actions: [
      //   {
      //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      //     onClick: ({ event }: { event: CalendarEvent }): void => {
      //       console.log('Edit event', event);
      //     },
      //   },
      // ]
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
    // console.log(date)
    if (this.created < this.allowance) {
      const newEvent: CalendarEvent = {
        start:date,
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()+45),
        title: 'New Event'
      }
      this.events = [
        ...this.events,
        newEvent
      ]
      this.created++;
    }
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    // const data = {
    //   event: event,
    //   canDelete: event?.meta?.delete ? true :false 
    // }

    console.log(event)
    this.eventDialog.open(EventDetailsDialogComponent,{
      data: event
    });
    // if (event?.meta?.canBeDeleted) {
    //   console.log('I can be deleted', event)
    // }
    // else console.log('Event clicked', event);
  }

  clickedDate: Date | undefined = undefined;
  clickedColumn: number | undefined= undefined;

  google (): void {
    this.api.authorize()
  }

  // async getEvents ():  {
  //   const headers = new Headers();
  //   headers.append('Authorization', 'bearer ' + this.access_token)
  //   return new Promise()
  // }

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
