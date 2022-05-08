import { Component, OnInit, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventProcessed } from 'src/app/interfaces/event.interface';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.component.html',
  styleUrls: ['./event-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  id: string 
  description: string;
  location: string;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public calendarEvent: EventProcessed,
  ) {
    
    this.title = calendarEvent.title;
    this.id = calendarEvent.id;
    this.description = calendarEvent.meta['description'];
    this.location = calendarEvent.meta['location'];

    this.form = this.fb.group({
      title: [this.title, [Validators.required]],
      id:[this.id, []],
      description: [this.description],
      location: [this.location]
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

