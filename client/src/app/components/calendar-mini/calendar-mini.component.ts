import { Component, Input, OnInit } from '@angular/core';
import { calendarPreview } from 'src/app/interfaces/calendar.interface';

@Component({
  selector: 'app-calendar-mini',
  templateUrl: './calendar-mini.component.html',
  styleUrls: ['./calendar-mini.component.scss']
})
export class CalendarMiniComponent implements OnInit {
  @Input() 
  data?: calendarPreview;
  @Input()
  past?: calendarPreview;
  start?: string;
  end?: string;

  constructor() { }

  ngOnInit(): void {
    if (this.data?.start && this.data.end) {
      this.start = this.parseDate(this.data.start);
      this.end = this.parseDate(this.data.end);
    }
    if (this.past?.start && this.past.end) {
      this.start = this.parseDate(this.past.start);
      this.end = this.parseDate(this.past.end);
    }

  }

  parseDate(isoDate: string) {
    const date = new Date(Date.parse(isoDate));
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month:'short',
      year: 'numeric',
      day: 'numeric'
    };

    const dtf = new Intl.DateTimeFormat(undefined, options);
    return dtf.format(date);
  }
}
