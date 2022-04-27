import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCalendarComponent } from './participant-calendar.component';

describe('ParticipantCalendarComponent', () => {
  let component: ParticipantCalendarComponent;
  let fixture: ComponentFixture<ParticipantCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
