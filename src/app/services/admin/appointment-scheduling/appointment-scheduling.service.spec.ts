import { TestBed } from '@angular/core/testing';

import { AppointmentSchedulingService } from './appointment-scheduling.service';

describe('AppointmentSchedulingService', () => {
  let service: AppointmentSchedulingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentSchedulingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
