import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddOrEditPatientComponent } from './admin-add-or-edit-patient.component';

describe('AdminAddOrEditDoctorComponent', () => {
  let component: AdminAddOrEditPatientComponent;
  let fixture: ComponentFixture<AdminAddOrEditPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddOrEditPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddOrEditPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
