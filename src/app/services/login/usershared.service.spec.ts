import { TestBed } from '@angular/core/testing';

import { UsersharedService } from './usershared.service';

describe('UsersharedService', () => {
  let service: UsersharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
