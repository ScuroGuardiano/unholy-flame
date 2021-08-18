import { TestBed } from '@angular/core/testing';

import { ConfirmWaitingDialogService } from './confirm-waiting-dialog.service';

describe('ConfirmWaitingDialogService', () => {
  let service: ConfirmWaitingDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmWaitingDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
