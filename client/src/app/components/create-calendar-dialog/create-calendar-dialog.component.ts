import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createCalendarDTO } from 'src/app/interfaces/calendar.interface';

@Component({
  selector: 'app-create-calendar-dialog',
  templateUrl: './create-calendar-dialog.component.html',
  styleUrls: ['./create-calendar-dialog.component.scss']
})
export class CreateCalendarDialogComponent implements OnInit {
  
  title: FormGroup;
  start: FormGroup;
  end: FormGroup
  // min: string; 
  minDate:Date = new Date();


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCalendarDialogComponent>,
  ) {
    // this.min = this.getCurrentTime()
    this.title = this.fb.group({
      title: ['', Validators.required], 
    });
    
    this.start = this.fb.group({
      startDate:[new Date(), Validators.required],
    });

    this.end = this.fb.group({
      endDate:[new Date(), Validators.required],
    });

    this.start.controls['startDate'].setValue(this.minDate);
    this.end.controls['endDate'].setValue(this.minDate);
   }

  ngOnInit(): void {
  }

  getCurrentTime() {
    const now = new Date();
    const offset = new Date(now).getTimezoneOffset() / 60;
    now.setHours(now.getHours() - offset)
    return now.toISOString().substring(0,16);
  }

  save() {
    const title = this.title.controls['title'].value
    const start = new Date(this.start.controls['startDate'].value).toISOString()
    const end = new Date(this.end.controls['endDate'].value).toISOString()
    
    const newCal : createCalendarDTO = {title, start, end}
    
    this.dialogRef.close(newCal)
  }

  close() {
    this.dialogRef.close()
  }
}
