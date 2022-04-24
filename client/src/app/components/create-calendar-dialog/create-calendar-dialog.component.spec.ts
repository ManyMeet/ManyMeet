import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalendarDialogComponent } from './create-calendar-dialog.component';

describe('CreateCalendarDialogComponent', () => {
  let component: CreateCalendarDialogComponent;
  let fixture: ComponentFixture<CreateCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCalendarDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
