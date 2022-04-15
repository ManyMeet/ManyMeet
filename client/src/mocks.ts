import {v4 as uuidv4} from 'uuid';
import { faker } from '@faker-js/faker';
import { colors } from './app/components/home/helpers/colors';
import { CalendarEvent } from 'angular-calendar';

function getEndDate (start: Date) {
  return new Date(2022, 3, start.getDate(), start.getHours(), start.getMinutes()+45)
}

function createEvent (day:number) {
  const id = uuidv4(),
        title = faker.random.words(5),
        start = faker.date.between(new Date(2022, 3, day, 9 ), new Date(2022, 3, day+4, 17 ).toISOString()),
        end = getEndDate(start),
        color = colors['red'],
        meta = { 
          canBeDeleted: false
        }

  return { id, title, start, end, color, meta}
}


export const mocks:mocks = {

  calendars : {
    "1": {
      minDate: new Date(2022, 3, 24, 9 ), 
      maxDate: new Date(2022, 3, 29, 17 ), 
      minHour : 9,
      maxHour : 17,
      events: [
        createEvent(25),
        createEvent(25),
        createEvent(25),
        createEvent(25),
        createEvent(25),
      ]
    },
    "2": {
      minDate: new Date(2022, 3, 10, 9 ), 
      maxDate: new Date(2022, 3, 16, 17 ), 
      minHour: 9,
      maxHour: 17,
      events: [
        createEvent(10),
        createEvent(10),
        createEvent(10),
        createEvent(10),
        createEvent(10),
      ]
    },
  }

}


interface mocks {
  calendars: {
    [key:string] : CalendarData
  }
  
}


interface CalendarData {
  minDate?: Date;
  maxDate?: Date;
  minHour?: number;
  maxHour?: number;
  events: CalendarEvent[];
}