import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { calendarPreview, updateCalendarDTO } from 'src/app/interfaces/calendar.interface';
import { participantRO } from 'src/app/interfaces/participant.interface';
import { ApiService } from 'src/app/services/api.service';
import { ParticipantDialogComponent } from '../participant-dialog/participant-dialog.component';
import * as uuid from 'uuid';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  host = window.location.protocol + "//" + window.location.host;
  
  id: string;
  calendar: calendarPreview;
  opened =  true;
  
  configureClientForm: FormGroup;
  clientConfigOpened = false;
  
  configureProviderForm: FormGroup;
  providerConfigOpened = true;
  
  addParticipantForm: FormGroup;
  addParticipantFormOpened = false;
  
  participantsAreSaved = true;
  providerMessage = '';
  providerSubject = '';
  clientMessage = '';
  clientSubject = '';

  // dummy :participantRO= {
  //   id:'a',
  //   name:'John Snow',
  //   email: 'John@theWall.com',
  //   message: 'This is a messssagee',
  //   subject: 'Subject',
  //   description:'This is a description',
  //   emailSent: false,
  //   type: 'provider',
  //   booked: false,
  //   calendar: '0853f086-1ed6-4cc0-b54b-839674643178'
  // }
 
  // dummy2 :participantRO= {
  //   id:'b',
  //   name:'Arya Stark',
  //   email: 'Arya@somewhere.com',
  //   message: 'This is a messssagee',
  //   subject: 'Subject',
  //   emailSent: true,
  //   type: 'provider',
  //   booked: true,
  //   calendar: '0853f086-1ed6-4cc0-b54b-839674643178',
  //   description:'I am Arya'
  // }
  
  // dummy3 :participantRO= {
  //   id:'c',
  //   name:'Many Meet',
  //   email: 'Arya@somewhere.com',
  //   message: 'This is a messssagee',
  //   subject: 'Subject',
  //   emailSent: true,
  //   type: 'client',
  //   booked: true,
  //   calendar: '0853f086-1ed6-4cc0-b54b-839674643178',
  //   description:'We are many meet'
  // }
  // dummy4 :participantRO= {
  //   id:'d',
  //   name:'Startup Wise Guys',
  //   email: 'Arya@somewhere.com',
  //   message: 'This is a messssagee',
  //   subject: 'Subject',
  //   description: 'this is some dummy data',
  //   emailSent: true,
  //   type: 'client',
  //   booked: true,
  //   calendar: '0853f086-1ed6-4cc0-b54b-839674643178'
  // }


  // providers: participantRO[] = [this.dummy, this.dummy2];
  // clients: participantRO[] = [this.dummy3, this.dummy4];
  providers: participantRO[] = [];
  clients: participantRO[] = [];
  columnsToDisplay = ['name', 'booked', 'emailed', 'link']

  constructor(
    private participantDialog: MatDialog,
    private apiService: ApiService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
  ) { 
    this.id = this.route.snapshot.paramMap.get('calendarId') || '';
    const calendars = localStorage.getItem('calendars');
    if (calendars) {
      this.calendar = JSON.parse(calendars)
                          .filter((cal : calendarPreview) => cal.id === this.id)[0]
    } else {
      this.calendar = {
        id: '',
        title:'Not Found',
      }
    }
    this.apiService.getCalendar(this.id).subscribe(data => {
        console.log('boom bitches')
        console.log('>>1', data.participants)

        const participants: participantRO[] = data.participants.map((p:participantRO) => {
          const booked = p.events && p.events.length ? true : false;
          console.log(booked)
          return {
            ...p,
            booked
          }
        })
        this.sortParticipants(participants);
      
    })

    const messageDefaults = localStorage.getItem(this.id);
    if (messageDefaults) {
      // This should be stored in the db in the future. Taking shortcuts now.
      const {clientSubject, clientMessage, providerSubject, providerMessage} = JSON.parse(messageDefaults)
      this.clientMessage = clientMessage;
      this.clientSubject = clientSubject;
      this.providerMessage = providerMessage;
      this.providerSubject = providerSubject;
    } else {
      this.clientSubject = `Book your sessions for ${this.calendar.title}`;
      this.clientMessage = `Hi %NAME%, \nYou're invited to book sessions for ${this.calendar.title}.`;
      this.providerSubject = `Offer your availability for ${this.calendar.title}`;
      this.providerMessage = `Hi %NAME% \nDo you have any availability to offer sessions for ${this.calendar.title}?`;
    }
    

    this.addParticipantForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/)]],     
      type: ['', Validators.required],
      description: ['']
    })

    this.configureClientForm = this.fb.group({
      subject: [this.clientSubject, Validators.required],
      message: [this.clientMessage, Validators.required],
      maxSessions: [''],
      bookSameProvider: ['No', Validators.required],
    })


    this.configureProviderForm = this.fb.group({
      subject: [this.providerSubject, Validators.required],
      message: [this.providerMessage, Validators.required],
      minSessions: [0]
    })

  }

  ngOnInit(): void {
  }

  sendEmail(participant: participantRO) {
    // send message to server to send email. 
    const participants = [...this.providers, ...this.clients].filter(p => p.id !== participant.id);
    participant.emailSent = true;
    participants.push(participant);
    this.handleParticipantUpdateSubmit()
  }

  sendAllEmails(type: string) {
    if (type === 'clients') {
      // send message to db to send all client emails. 
      this.clients.map(p => p.emailSent = true);
       
    } else {
      this.providers.map(p => p.emailSent = true)
    }

    this.handleParticipantUpdateSubmit();
  }


  updateConfigs(){
    const clientConfig = this.configureClientForm;
    const providerConfig = this.configureProviderForm;

    if (clientConfig.valid && providerConfig.valid ) {
    
      const messageDefaults = {
        clientSubject: clientConfig.controls['subject'].value,
        clientMessage: clientConfig.controls['message'].value,
        providerSubject: providerConfig.controls['subject'].value,
        providerMessage: providerConfig.controls['message'].value,
      }
      localStorage.setItem(this.id, JSON.stringify(messageDefaults))
        
    }
  }

  handleParticipantUpdateSubmit() {
    const updateCalendarData: updateCalendarDTO = {
      id: this.id,
      participants: [...this.providers, ...this.clients]
    }

    this.apiService.updateCalendar(updateCalendarData).subscribe(data => {
      if (data.ok) {
        console.log('boom bitches');
        console.log(data);
        this.participantsAreSaved = true;
      } else {
        console.log('damn ... shit fucked up.')
      }
    })
  }

  addParticipant() {
    if (!this.addParticipantForm.invalid) {
      const {type, name, email, description} = this.addParticipantForm.value
      let subject, message;
      if (type ==='client') {
        subject = this.configureClientForm.controls['subject'].value;
        message = this.configureClientForm.controls['message'].value.replace('%NAME%', name)
        
      } else {
        subject = this.configureProviderForm.controls['subject'].value;
        message = this.configureProviderForm.controls['message'].value.replace('%NAME%', name)
      }

      const participant : participantRO = {
        email, name, description, type, subject, message,
        calendar: this.id,
        id: uuid.v4(),
        booked: false,
        emailSent: false, 
      }
      this.sortParticipants([...this.clients, ...this.providers, participant])
      this.participantsAreSaved = false;
      
      const resetForm:HTMLFormElement = document.getElementById('addParticipantForm') as HTMLFormElement;
      resetForm.reset()
  
    }
  }

  copyToClipboard(participantId: string) {
    const url = `${this.host}/${this.id}/${participantId}`
    navigator.clipboard.writeText(url)
  }

  sortParticipants(allParticipants: participantRO[]) {
    this.providers = allParticipants.filter(participant => participant.type === 'provider');
    this.clients = allParticipants.filter(participant => participant.type === 'client');
  }


  openParticipantDialog(participant: participantRO) {

    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = participant;
    dialogConfig.minHeight = 400;
    dialogConfig.minWidth = 400;
    dialogConfig.autoFocus = "#name";
    const dialogRef = this.participantDialog.open(ParticipantDialogComponent, dialogConfig)

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {return};
      if (data.action === 'save') {
        const allParticipants = [...this.clients, ...this.providers].filter(participant => participant.id !== data.participant.id);
        allParticipants.push(data.participant);
        this.sortParticipants(allParticipants);
      } else {
        const allParticipants = [...this.clients, ...this.providers].filter(participant => participant.id !== data.participant.id);
        this.sortParticipants(allParticipants);
      }
      this.participantsAreSaved = false;
      
    })

  }
}
