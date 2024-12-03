import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddOrEditDoctorComponent } from './admin-add-or-edit-doctor.component';

describe('AdminAddOrEditDoctorComponent', () => {
  let component: AdminAddOrEditDoctorComponent;
  let fixture: ComponentFixture<AdminAddOrEditDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddOrEditDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddOrEditDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
