import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMiniComponent } from './calendar-mini.component';

describe('CalendarMiniComponent', () => {
  let component: CalendarMiniComponent;
  let fixture: ComponentFixture<CalendarMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
