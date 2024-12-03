
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminService} from '../../services/admin/admin.service';
import {UsersharedService} from '../../services/login/usershared.service';
import {User} from '../../services/interfaces/loginInterface/user.interface';
import {Router} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {Admin} from '../../services/interfaces/admin/admin-profile.interface';
@Component({
  selector: 'app-edit-admin-profile',
  standalone: true,
  imports: [
    MatCardContent,
    MatCard,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-admin-profile.component.html',
  styleUrls: ['./edit-admin-profile.component.css']
})
export class EditAdminProfileComponent implements OnInit {
  adminProfileForm: FormGroup;
  formSubmittedMessage: string = '';
  private _errorMessage: string = '';
  timeoutHandle: any;
  user: User | null=null;
  admin:Admin | null=null;

  // Getter for errorMessage
  get errorMessage(): string {
    return this._errorMessage;
  }

  // Setter for errorMessage
  set errorMessage(value: string) {
    this._errorMessage = value;

    if (value) {
      // Clear any existing timeout to avoid multiple timers
      clearTimeout(this.timeoutHandle);

      // Set a timeout to clear the message after 4 seconds
      this.timeoutHandle = setTimeout(() => {
        this._errorMessage = '';
      }, 5000);
    }
  }

  constructor(private fb: FormBuilder,private usersharedservice:UsersharedService, private adminService: AdminService,private router:Router) {
    this.adminProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {

    this.user=this.usersharedservice.getCurrentUser();
    if(this.user == null){
      this.router.navigate(['login'])
    }

    this.adminService.getAdminProfile(this.user!.id).subscribe({
      next: (profile) => {
        this.admin=profile;
        this.adminProfileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: ''
        });
      },
      error: () => {
        this.errorMessage = 'Failed to fetch admin profile';
      }
    });
  }


  submitAdminProfile(): void {
    if (this.adminProfileForm.valid && this.admin!=null) {
      const updatedProfile: Admin = {
        id: this.admin.id,
        userid: this.admin.userid,
        email: this.adminProfileForm.value.email,
        firstName: this.adminProfileForm.value.firstName,
        lastName: this.adminProfileForm.value.lastName,
      };

      this.adminService.updateAdminProfile(updatedProfile).subscribe({
        next: () => {
          this.formSubmittedMessage = 'Profile updated successfully!';
        },
        error: (err) => {
          switch (err.status) {
            case 404:
              this.errorMessage = 'Failed to update as admin or user not found';
              break;
            case 409:
              this.errorMessage = 'Email Already Exists';
              break;
            default:
              this.errorMessage = 'Failed to update profile due to internal server error';
              break;
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
