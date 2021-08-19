import { TestBed } from '@angular/core/testing';

import { BetterTagService } from './better-tag.service';

describe('BetterTagService', () => {
  let service: BetterTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetterTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
