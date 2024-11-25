import { TestBed } from '@angular/core/testing';

import { PatientoverviewService } from './patientoverview.service';

describe('PatientoverviewService', () => {
  let service: PatientoverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientoverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
