import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminProfileComponent } from './edit-admin-profile.component';

describe('EditAdminProfileComponent', () => {
  let component: EditAdminProfileComponent;
  let fixture: ComponentFixture<EditAdminProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdminProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdminProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
