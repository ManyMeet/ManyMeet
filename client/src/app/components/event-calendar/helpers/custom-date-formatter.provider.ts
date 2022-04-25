import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public override monthViewColumnHeader({ date, locale ='en-En' }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale);
  }

  public override monthViewTitle({ date, locale='en-En' }: DateFormatterParams): string {
    return formatDate(date, 'MMM y', locale);
  }

  public override weekViewColumnHeader({ date, locale='en-En' }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale);
  }

  public override dayViewHour({ date, locale ='en-En' }: DateFormatterParams): string {
    return formatDate(date, 'HH:mm', locale);
  }
}