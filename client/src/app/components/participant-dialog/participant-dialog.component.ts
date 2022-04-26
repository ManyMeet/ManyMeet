import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Name } from '@faker-js/faker/name';
import { participantRO } from 'src/app/interfaces/participant.interface';

@Component({
  selector: 'app-participant-dialog',
  templateUrl: './participant-dialog.component.html',
  styleUrls: ['./participant-dialog.component.scss']
})
export class ParticipantDialogComponent implements OnInit {

  form: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<ParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public participant: participantRO
  ) { 

    this.form = this.fb.group({
      id: [participant.id],
      name: [participant.name, Validators.required],
      email: [participant.email, Validators.required],
      description: [participant.description],
      subject: [participant.subject, Validators.required],
      message: [participant.message, Validators.required],
      type: [participant.type, Validators.required],
      emailSent: [participant.emailSent],
      booked: [participant.booked]      
    })

  }

  ngOnInit(): void {
  }

  onCloseClick() {
    this.dialogRef.close()
  }

  save() {
    if (!this.form.invalid){
      const res = {
        action: 'save',
        participant: this.form.value
      }
      this.dialogRef.close(res)

    }
  }

  delete() {
    const res = {
      action: 'delete',
      participant: this.form.value
    }

    this.dialogRef.close(res)
  }

}
