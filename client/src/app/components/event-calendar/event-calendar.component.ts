import { v4 as uuidv4 } from 'uuid';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewEncapsulation, ɵɵsetComponentScope, Input } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarMonthViewDay, CalendarDateFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ignoreElements, Subject } from 'rxjs';
import { GoogleService } from 'src/app/services/google.service';
import { ApiService } from 'src/app/services/api.service';
import { EventDetailsDialogComponent } from '../event-details-dialog/event-details-dialog.component';
import { colors } from './helpers/colors';
import { CustomDateFormatter } from './helpers/custom-date-formatter.provider';
import { calendarRO, googleCalendarListItem, updateCalendarDTO } from 'src/app/interfaces/calendar.interface';
import { differenceInMinutes, startOfHour, startOfDay } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventRO } from 'src/app/interfaces/event.interface';

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
  minHour?: Date;
  maxHour?: Date;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  authorized: string | null = localStorage.getItem('authorized');
  googleAuthUrl?: string;
  events: CalendarEvent[] = [];
  calendar?: calendarRO;
  id: string;

  googleAccounts: {[key:string] : googleCalendarListItem } = {};
  listeningForMessage = false;
  
  clickedDate: Date | undefined = undefined;
  clickedColumn: number | undefined = undefined;

  updateCalendarForm: FormGroup;
  eventConfigForm: FormGroup;
  eventConfigOpened = false;
  calendarDetailsOpened = true;

  defaultDuration = 30;
  defaultTitle = 'Open Slot';
  defaultDescription = '';
  defaultLocation = '';
  eventsAreSaved = true;

  refresh = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private googleService: GoogleService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.id = this.route.snapshot.paramMap.get('calendarId') || '';
    if (this.id !== '') {
      this.apiService.getCalendar(this.id).subscribe(calendar => {
        this.calendar = calendar;
        this.viewDate = new Date(Date.parse(calendar.start));
        this.minDate = this.viewDate;
        this.maxDate = new Date(Date.parse(calendar.end));
        this.maxDate.setHours(23, 59, 59, 59)
        const [minHour, minMinutes] = calendar.minHour.split(":")
        const [maxHour, maxMinutes] = calendar.maxHour.split(":")
        this.minHour = new Date(0);
        this.minHour.setHours(parseInt(minHour), parseInt(minMinutes))
        this.maxHour = new Date(0);
        this.maxHour.setHours(parseInt(maxHour), parseInt(maxMinutes))
        this.defaultDescription = calendar.defaultDescription;
        this.defaultDuration = calendar.defaultDuration;
        this.defaultLocation = calendar.defaultLocation;
        this.defaultTitle = calendar.defaultTitle;
        this.events = calendar.events.map(ev => {
          const event: CalendarEvent = {
            id: ev.id,
            title: ev.title,
            start: new Date(Date.parse(ev.start)),
            end: new Date(Date.parse(ev.end)),
            meta: JSON.parse(ev.meta),
          }

          if (!ev.provider && !ev.client) {
            event.draggable = true;
            event.resizable = {
              beforeStart: true,
              afterEnd: true
            }
          } else {
            if (ev.provider && !ev.client) {
              event.meta.canBeDeleted = false;
              event.cssClass = 'hasProvider';
            }

            if (ev.provider && ev.client) {
              event.meta.canBeDeleted = false;
              event.cssClass = 'hasClient';
            }

          }

          return event
        });
        this.scrollToView();
        this.refresh.next();

        this.updateCalendarForm.controls['title'].setValue(calendar.title);
        this.updateCalendarForm.controls['startDate'].setValue(calendar.start);
        this.updateCalendarForm.controls['endDate'].setValue(calendar.end);
        this.updateCalendarForm.controls['startTime'].setValue(calendar.minHour);
        this.updateCalendarForm.controls['endTime'].setValue(calendar.maxHour);

        this.eventConfigForm.controls['title'].setValue(calendar.defaultTitle);
        this.eventConfigForm.controls['location'].setValue(calendar.defaultLocation);
        this.eventConfigForm.controls['duration'].setValue(calendar.defaultDuration);
        this.eventConfigForm.controls['description'].setValue(calendar.defaultDescription);
      })
    }

    this.updateCalendarForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    })

    this.eventConfigForm = this.fb.group({
      duration: [this.defaultDuration],
      title: [this.defaultTitle],
      description: [this.defaultDescription],
      location: [this.defaultLocation]
    })
    const org = true;
    this.apiService.getGoogleOAuthUrl(org).subscribe(url => this.googleAuthUrl = url);

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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    if (event.start.toISOString() !== newStart.toISOString() &&
      event.end?.toISOString() !== newEnd?.toDateString
    ) {
      this.eventsAreSaved = false;
    }
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
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

  dayClicked(date: Date, events?: CalendarEvent[]): void {
    if (!this.isDateValid(date)) return;

    this.eventConfigOpened = true;
    this.calendarDetailsOpened = false;
    const newEvent: CalendarEvent = {
      start: date,
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + this.defaultDuration),
      title: this.defaultTitle,
      id: uuidv4(),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      meta: {
        canBeDeleted: true,
        editable: true,
        description: this.defaultDescription,
        location: this.defaultLocation,
        syncedEvent: false
      }
    }
    this.eventsAreSaved = false;
    this.events = [
      ...this.events,
      newEvent
    ]
    this.refresh.next();

  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = event;
    dialogConfig.minHeight = 400;
    dialogConfig.minWidth = 400;
    dialogConfig.autoFocus = "#title";
    const dialogRef = this.dialog.open(EventDetailsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (!data) return;

      if (data.action === 'delete') {
        this.events = this.events.filter(ev => ev.id !== data.event.id);
        this.eventsAreSaved = false;
      };

      if (data.action === 'save') {
        const ev = this.events.find(ev => ev.id === data.event.id);
        if (ev) ev.title = data.event.title;
        this.events = new Array(...this.events);
        this.refresh.next();
        this.eventsAreSaved = false;
      }

    })

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
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop = (minutesSinceStartOfDay - 30);
        }
      }
    }
  }

  setExternalCalendars() {
    const org = true
    this.apiService.getExternalCalendars(org).subscribe(calendars => {
      const account = calendars.find((cal:googleCalendarListItem) => cal.primary == true).id;
      const googleAccounts = {...this.googleAccounts};
      googleAccounts[account] = calendars;
      this.googleAccounts = googleAccounts;
      console.log(this.googleAccounts)
    });
    
  }

  addGoogleAccount() {
    if (!this.listeningForMessage) {
      window.addEventListener('message', () => this.setExternalCalendars())
      this.listeningForMessage = true;
    }
    const popupFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    const popup = window.open(this.googleAuthUrl, 'googleAuth', popupFeatures);
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

  handleCalendarUpdateSubmit() {
    if (this.calendar) {
      const { title, startDate, endDate, startTime, endTime } = this.updateCalendarForm.value;
      const updateCalendarData: updateCalendarDTO = {
        id: this.id,
        title: title,
        start: startDate,
        end: endDate,
        minHour: startTime,
        maxHour: endTime
      }

      this.apiService.updateCalendar(updateCalendarData).subscribe(res => {
        if (res.ok) {
          let storedCalendars = localStorage.getItem('calendars');
          if (storedCalendars) {
            const calendars = JSON.parse(storedCalendars);
            let updatedCalendars = calendars.filter((cal: calendarRO) => cal.id !== res.calendar.id)

            localStorage.setItem('calendars', JSON.stringify([
              ...updatedCalendars,
              {
                id: res.calendar.id,
                title: res.calendar.title,
                start: res.calendar.start,
                end: res.calendar.end,
              }
            ]))
          }

          this.minDate = new Date(res.calendar.start);
          this.viewDate = this.minDate;
          this.maxDate = new Date(res.calendar.end);
          this.minDate = this.viewDate;
          this.maxDate = new Date(Date.parse(res.calendar.end));
          this.maxDate.setHours(23, 59, 59, 59);
          const [minHour, minMinutes] = res.calendar.minHour.split(":")
          const [maxHour, maxMinutes] = res.calendar.maxHour.split(":")
          this.minHour = new Date(0);
          this.minHour.setHours(parseInt(minHour), parseInt(minMinutes))
          this.maxHour = new Date(0);
          this.maxHour.setHours(parseInt(maxHour), parseInt(maxMinutes))
          this.calendar = res.calendar;
          this.defaultDescription = res.calendar.defaultDescription;
          this.defaultDuration = res.calendar.defaultDuration;
          this.defaultLocation = res.calendar.defaultLocation;
          this.defaultTitle = res.calendar.defaultTitle;
          this.events = res.calendar.events.map((ev: EventRO) => {
            const event: CalendarEvent = {
              id: ev.id,
              title: ev.title,
              start: new Date(Date.parse(ev.start)),
              end: new Date(Date.parse(ev.end)),
              meta: JSON.parse(ev.meta),

            }
            if (!ev.provider && !ev.client) {
              event.draggable = true;
              event.resizable = {
                beforeStart: true,
                afterEnd: true
              }
            }
            return event
          });


          this.refresh.next();
          this.scrollToView();

        } else {
          //handle error ?
          console.log(res)
        }

      })
    }
  }

  handleEventConfigSubmit() {
    const updateCalendarData: updateCalendarDTO = {
      defaultDescription: this.eventConfigForm.value.description,
      defaultDuration: this.eventConfigForm.value.duration,
      defaultLocation: this.eventConfigForm.value.location,
      defaultTitle: this.eventConfigForm.value.title,
      id: this.id,
    }


    this.apiService.updateCalendar(updateCalendarData).subscribe(res => {
      if (res.ok) {
        console.log('boom bitches');
      } else {
        console.log('cry bitch!');
      }
    })

  }



  handleEventUpdateSubmit() {

    if (this.id !== '') {

      const events = this.events
        .filter(ev => !ev.meta.syncedEvent && ev.id)
        .map(ev => {
          if (!ev.end) ev.end = ev.start; // why!?

          return {
            // ...ev, 
            id: ev.id ? ev.id : '',
            title: ev.title,
            start: ev.start.toISOString(),
            end: ev.end.toISOString(),
            meta: JSON.stringify(ev.meta),
            calendar: this.id
          }
        })
      const updateCalendarData: updateCalendarDTO = {
        defaultDescription: this.eventConfigForm.value.description,
        defaultDuration: this.eventConfigForm.value.duration,
        defaultLocation: this.eventConfigForm.value.location,
        defaultTitle: this.eventConfigForm.value.title,
        id: this.id,
        events: events

      }

      console.log(updateCalendarData)

      this.apiService.updateCalendar(updateCalendarData).subscribe(res => {
        if (res.ok) {
          this.eventsAreSaved = true;
          console.log('boom bitches');
        } else {
          console.log('cry bitch!');
        }
      })

    }

  }

  handleDurationChange() {
    this.defaultDuration = this.eventConfigForm.controls['duration'].value;
  }
  handleTitleChange() {
    this.defaultTitle = this.eventConfigForm.controls['title'].value;
  }

  handleLocationChange() {
    this.defaultLocation = this.eventConfigForm.controls['location'].value;
  }

  handleDescriptionChange() {
    this.defaultDescription = this.eventConfigForm.controls['description'].value;
  }


}
