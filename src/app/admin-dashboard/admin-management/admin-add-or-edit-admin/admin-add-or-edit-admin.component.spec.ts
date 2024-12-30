import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddOrEditAdminComponent } from './admin-add-or-edit-admin.component';

describe('AdminAddOrEditDoctorComponent', () => {
  let component: AdminAddOrEditAdminComponent;
  let fixture: ComponentFixture<AdminAddOrEditAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddOrEditAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddOrEditAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
