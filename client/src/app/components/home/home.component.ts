import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  changeView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({date, events}: {date:Date; events: CalendarEvent[]}) :void {
    console.log(date)
  }
}
