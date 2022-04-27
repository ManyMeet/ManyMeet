import { v4 as uuidv4 } from 'uuid';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, ɵɵsetComponentScope, Input } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarMonthViewDay, CalendarDateFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ignoreElements, Subject } from 'rxjs';
import { GoogleService } from 'src/app/services/google.service';
import { ApiService } from 'src/app/services/api.service';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { colors } from '../event-calendar/helpers/colors';
import { CustomDateFormatter } from '../event-calendar/helpers/custom-date-formatter.provider';
import { calendarRO, updateCalendarDTO } from 'src/app/interfaces/calendar.interface';
import { differenceInMinutes, startOfHour, startOfDay } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventRO } from 'src/app/interfaces/event.interface';
import { participantRO } from 'src/app/interfaces/participant.interface';

@Component({
  selector: 'app-participant-calendar',
  templateUrl: './participant-calendar.component.html',
  styleUrls: ['./participant-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
  ]
})
export class ParticipantCalendarComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;

  
  opened: boolean = true;
  viewDate: Date = new Date();
  minDate?: Date;
  maxDate?: Date;
  minHour?: Date;
  maxHour?: Date;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized');
  events: CalendarEvent[] = [];
  calendar?: calendarRO;
  
  id = ''; 
  participantId = '';
  participant?: participantRO;

  clickedDate: Date | undefined = undefined;
  clickedColumn: number | undefined = undefined;


  defaultDuration = 30;
  defaultTitle = 'Open Slot';
  defaultDescription = '';
  defaultLocation = '';
  eventsAreSaved = true;

  refresh = new Subject<void>();

  constructor(
    public eventDialog: MatDialog,
    private googleService: GoogleService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.id = this.route.snapshot.paramMap.get('calendarId') || '';
    this.participantId = this.route.snapshot.paramMap.get('participantId') || '';

    if (this.id !== '') {
      this.apiService.getCalendar(this.id).subscribe(calendar => {
        this.participant = calendar.participants.find(p => p.id === this.participantId)
        if (!this.participant) {
          this.router.navigate(['auth/login']);
          return;
        } 
        this.calendar = calendar;
        this.viewDate = new Date(Date.parse(calendar.start));
        this.minDate = this.viewDate;
        this.maxDate = new Date(Date.parse(calendar.end));
        this.maxDate.setHours(23,59,59,59)
        const[minHour,minMinutes] = calendar.minHour.split(":")
        const [maxHour, maxMinutes] = calendar.maxHour.split(":")
        this.minHour = new Date(0);
        this.minHour.setHours(parseInt(minHour), parseInt(minMinutes))
        this.maxHour = new Date(0);
        this.maxHour.setHours(parseInt(maxHour), parseInt(maxMinutes))
        let events :EventRO[];
        let participantEvents
        if (this.participant.type === 'provider') {
          participantEvents = calendar.events.filter(ev => ev.provider === this.participantId);
      
          events = calendar.events.filter(ev => !ev.provider || ev.provider === this.participantId);
          } else {
          events = calendar.events.filter(ev => (ev.provider && !ev.client) || (ev.client === this.participantId) )
          }
        if (participantEvents) {
          participantEvents.forEach(pEvent => {
            const meta = JSON.parse(pEvent.meta);
            if (meta.originalId) {
              events = events.filter(ev => ev.id !== meta.originalId)
            }
          })
        }

        const booked = (ev: CalendarEvent) => {
          return (ev.meta.client === this.participantId ) || (ev.meta.provider === this.participantId);
        } 

        this.events = events.map(ev => {
          const event : CalendarEvent= {
            id:ev.id,
            title: ev.title,
            start: new Date(Date.parse(ev.start)),
            end: new Date(Date.parse(ev.end)),
            meta: JSON.parse(ev.meta),
         }
          if (this.participant && this.participant.type === 'provider') {
            event.cssClass = booked(event)  ? 'bookedEvent' : '';
          } else if (this.participant && this.participant.type === 'client') {
            event.cssClass = booked(event)  ? 'clientBooked' : '';
          }
          event.draggable = false;
          event.resizable = {
            beforeStart:false,
            afterEnd: false
          }
          return event
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
    let compareDate = new Date(date);
    if (this.minDate && this.maxDate) {
      validDate = (compareDate >= this.minDate) && (compareDate <= this.maxDate);
    }
    if (this.minHour && this.maxHour) {
      let compareDate = new Date(0);
      compareDate.setHours(date.getHours(), date.getMinutes())
      validHour = (compareDate >= this.minHour) && (compareDate < this.maxHour);
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


  eventClicked({ event }: { event: CalendarEvent }): void {
    if (this.participant && this.participant.type === 'provider') {
      this.eventsAreSaved = false;

      if (event.meta.provider !== this.participantId) {

        event.meta.originalTitle = event.title;
        event.meta.provider = this.participantId;
        event.meta.delete = false;
        event.meta.originalId = event.id;
        if (event.meta.isNewEvent === undefined) {
          event.meta.isNewEvent = true;
        }
        event.title = this.participant.name;
        event.cssClass = 'bookedEvent';
      } else {

        event.title = event.meta.originalTitle;
        delete event.meta.originalTitle;
        delete event.meta.provider
        delete event.meta.originalId
        event.meta.delete = true;
        event.cssClass = '';
      }

    }

    if (this.participant && this.participant.type === 'client') {
      this.eventsAreSaved = false;
      if (event.meta.client !== this.participantId) {
        event.meta.originalTitle = event.title;
        event.meta.client = this.participantId;
        event.title = `${this.participant.name}<>${event.title}`;
        event.cssClass = 'clientBooked';
      } else {
        event.title = event.meta.originalTitle;
        delete event.meta.client;
        delete event.meta.originalTitle;
        event.cssClass = '';
      }
    }
  }


  private scrollToView() {
    if (this.view === CalendarView.Week || CalendarView.Day) {
      if (this.minDate && this.minHour) {
        const hourStart = new Date(this.minDate)
        hourStart.setHours(this.minHour.getHours());
        hourStart.setMinutes(this.minHour.getMinutes());

        const minutesSinceStartOfDay = differenceInMinutes(
          startOfHour(hourStart),
          startOfDay(this.minDate)
        )
        if(this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop = (minutesSinceStartOfDay - 30);
        }
      }
    }
  }

  google(): void {
    this.googleService.authorize()
  }

  getEvents(): void {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    const searchParams: { [key: string]: string } = {
      timeMin: this.minDate?.toISOString() || startDate,
      timeMax: this.maxDate?.toISOString() || lastDate,
      orderBy: 'startTime',
      singleEvents: 'True'
    }
    this.googleService.getEvents(searchParams).subscribe(events => {
      for (let ev of events) {
        this.events = [
          ...this.events,
          {
            start: new Date(ev.start.dateTime) || new Date(ev.start.date),
            end: new Date(ev.end.dateTime) || new Date(ev.end.date),
            id: ev.id,
            color: colors['green'],
            title: ev.summary,
            cssClass: 'GoogleEvent',
            meta: {
              description: ev.description,
              editable: false,
              canBeDeleted: false,
              syncedEvent: true
            }
          }
        ]
      }

    });
  }


  handleEventUpdateSubmit() {
    // if (this.participant && this.participant.type === 'provider') {
      // const events = this.events.filter(ev => ev.meta.provider === this.participantId);
      const newEvents = this.events.filter(ev => ev.meta.syncedEvent === false ).map(ev => {
        if (ev.meta.isNewEvent) {
      
          ev.id = uuidv4();
          ev.meta.isNewEvent = false;
        }
        return {
          id : (ev.id as string),
          title: ev.title,
          start: ev.start.toISOString(),
          end: ev.end ? ev.end.toISOString() : undefined,
          meta: JSON.stringify(ev.meta),
          calendar: this.id,
        } 
      })

      const calData : updateCalendarDTO = {
        id: this.id,
        events: newEvents
      }

      this.apiService.updateCalendar(calData).subscribe(data => {
        if (data.ok){
          console.log('boom bitches')
          this.eventsAreSaved = true;
        } else {
          console.log('shit fucked up')
        }
      })


    // }
   

  }
  

}
