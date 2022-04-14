import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  id: string | number | undefined;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public calendarEvent: CalendarEvent
  ) {
    this.title = calendarEvent.title;
    this.id = calendarEvent.id
    this.form = this.fb.group({
      title: [this.title, []],
      id:[this.id, []]
    })
   }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  save() {
    const res = {
      action: 'save',
      event: this.form.value
    }
    this.dialogRef.close(res);
  }
  
  delete() {
    const res = {
      action: 'delete',
      event: { id: this.form.get('id')?.value }
    }
    this.dialogRef.close(res);
  }


}

