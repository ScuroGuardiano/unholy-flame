import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWaitingDialogComponent } from './confirm-waiting-dialog.component';

describe('ConfirmWaitingDialogComponent', () => {
  let component: ConfirmWaitingDialogComponent;
  let fixture: ComponentFixture<ConfirmWaitingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmWaitingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmWaitingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
