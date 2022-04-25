import {v4 as uuidv4 } from 'uuid';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarMonthViewDay, CalendarDateFormatter } from 'angular-calendar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GoogleService } from 'src/app/services/google.service';
import { ApiService } from 'src/app/services/api.service';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { colors } from './helpers/colors';
import { CustomDateFormatter } from './helpers/custom-date-formatter.provider';
import { calendarRO } from 'src/app/interfaces/calendar.interface';
import { differenceInMinutes, startOfHour, startOfDay } from 'date-fns';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
   { 
    provide: CalendarDateFormatter, 
    useClass: CustomDateFormatter
    },
  ]
})
export class EventCalendarComponent implements AfterViewInit {

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;

  opened: boolean = true;
  viewDate: Date = new Date();
  minDate?: Date; 
  maxDate?: Date;
  minHour?: number;
  maxHour?: number;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized');
  events: CalendarEvent[] = [];
  calendar?: calendarRO;

  clickedDate: Date | undefined = undefined;
  clickedColumn: number | undefined= undefined;
  // allowance: number = 10;
  // created: number = 0;

  refresh = new Subject<void>();

  constructor (
    public eventDialog:MatDialog,
    private googleService: GoogleService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      const id = this.route.snapshot.paramMap.get('calendarId');
      if (id) {
        this.apiService.getCalendar(id).subscribe(calendar => {
          this.calendar = calendar;
          this.viewDate = new Date(Date.parse(calendar.start));
          this.minDate = this.viewDate;
          this.maxDate = new Date(Date.parse(calendar.end));
          this.minHour = 9;
          this.maxHour = 21;
          this.events = calendar.events.map(ev => {
            return {
              ...ev, 
              start: new Date(Date.parse(ev.start)),
              end: new Date(Date.parse(ev.end)),
            }
          });
          this.scrollToView();
          this.refresh.next();
        })
       }
     }


  ngAfterViewInit() {
    // this.scrollToView();
  }

  isDateValid(date: Date): boolean {
    let validDate: boolean = true;
    let validHour: boolean = true;
    if (this.minDate && this.maxDate) {
      validDate = (date >= this.minDate) && (date <= this.maxDate);
    }
    if (this.minHour && this.maxHour) {
      validHour = (date.getHours() >= this.minHour) && (date.getHours() <= this.maxHour);
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
    if (!this.isDateValid(date)) return;
    // if (this.created < this.allowance) {
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
      this.refresh.next();
      // this.created++;
    // }
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
        this.events = new Array(...this.events);
        this.refresh.next();
      }

    })
    
  }



  private scrollToView() {
    if (this.view === CalendarView.Week || CalendarView.Day ) {
      if (this.minDate){ 
        const minutesSinceStartOfDay = differenceInMinutes(
          startOfHour(this.minDate),
          startOfDay(this.minDate)
        )
        if (this.scrollContainer){
          const toScroll = this.scrollContainer.nativeElement.firstElementChild?.firstElementChild?.lastElementChild;
          if (toScroll) {
            toScroll.scrollTop = minutesSinceStartOfDay;
          }
        }
      }
    }
  }

  google (): void {
    this.googleService.authorize()
  }
  
  getEvents() : void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    const searchParams : {[key:string]: string} = {
      timeMin:this.minDate?.toISOString() || startDate,
      timeMax:this.maxDate?.toISOString() || lastDate,
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
