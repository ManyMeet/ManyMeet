import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { calendarPreview } from 'src/app/interfaces/calendar.interface';
import { UserRO } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  calendars: UserRO['calendars'] = [];

  constructor(
    private route: ActivatedRoute, 
    private router:Router
    ) {
      if (this.router.getCurrentNavigation()?.extras) {
        let state = this.router.getCurrentNavigation()?.extras.state;
        if (state && state['calendars']){ 
          const sortedCals =  this.sort(state['calendars']) 
          localStorage.setItem('calendars', JSON.stringify(sortedCals))
          this.calendars = sortedCals
        } 
      }
      if (!this.calendars.length) {
        const calendars = localStorage.getItem('calendars');
        if (calendars) {
          this.calendars = JSON.parse(calendars);
        }
      }
    }

  ngOnInit(): void {

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
}
