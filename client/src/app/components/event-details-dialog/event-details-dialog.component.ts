import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog'

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public calendarEvent: CalendarEvent
  ) { }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.dialogRef.close();
  }

}

type customEvent = {
  event: CalendarEvent,
  canDelete: boolean;
}