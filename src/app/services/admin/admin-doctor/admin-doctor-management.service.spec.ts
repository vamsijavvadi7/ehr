import { TestBed } from '@angular/core/testing';

import { AdminDoctorManagementService } from './admin-doctor-management.service';

describe('AdminDoctorManagementService', () => {
  let service: AdminDoctorManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDoctorManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
