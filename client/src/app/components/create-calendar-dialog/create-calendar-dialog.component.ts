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
  minDate:Date = new Date();


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCalendarDialogComponent>,
  ) {
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

  save() {
    const title = this.title.controls['title'].value
    const startDate = new Date(this.start.controls['startDate'].value);
    startDate.setHours(0,0,0,0);
    const start = startDate.toISOString()
    const endDate = new Date(this.end.controls['endDate'].value)
    endDate.setHours(23,59,59,59);
    const end = endDate.toISOString();
    const newCal : createCalendarDTO = {title, start, end}
    
    this.dialogRef.close(newCal)
  }

  close() {
    this.dialogRef.close()
  }
}
