import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin/admin.service';
import {Admin} from '../../../services/interfaces/admin/admin-profile.interface';

@Component({
  selector: 'admin-add-or-edit-admin',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgIf,
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './admin-add-or-edit-admin.component.html',
  styleUrl: './admin-add-or-edit-admin.component.css'
})
export class AdminAddOrEditAdminComponent implements OnInit {
  adminProfile!: Admin;
  adminProfileForm: FormGroup;
  formSubmittedMessage:String = '';
  adminid: number = -1;
  userid: number = -1;
  private _errorMessage: string = '';
  timeoutHandle: any;
  @Input() mode: 'add' | 'edit' = 'edit';
  // Setter for errorMessage
  @Input() admin!: Admin;
  @Output() backToAdminPanelClicked = new EventEmitter<string>();

  // Getter for errorMessage
  get errorMessage(): string {
    return this._errorMessage;
  }



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

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.adminProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    if(this.mode=='edit') {
      this.adminProfile = this.admin;
      this.adminid = this.adminProfile.id;
      this.userid = this.adminProfile.userid;
      this.adminProfileForm = this.fb.group({
        firstName: [this.adminProfile.firstName],
        lastName: [this.adminProfile.lastName],
        email: ['']
      })
    }
  }




  submitAdminProfile(): void {

    if (this.adminProfileForm.valid) {

      const admindetails: any = {
        id:  this.mode=='edit'?this.adminid:'',
        userid: this.mode=='edit'?this.userid:'',
        email: this.adminProfileForm.value.email,
        firstName: this.adminProfileForm.value.firstName,
        lastName: this.adminProfileForm.value.lastName,
        isActive:this.adminProfile?.isActive?this.adminProfile?.isActive:true,
      };

      if(this.mode=='edit') {
        this.adminService.updateAdmin(admindetails).subscribe({
          next: (profile) => {
            this.adminProfile = profile;
            this.formSubmittedMessage = 'Admin Updated Successfully';
            this.backToAdminPanel();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update the admin check the details before trying again';
          }
        });
      }
      else {
        this.adminService.createAdmin(admindetails).subscribe(
          {
            next:(profile) => {
              this.adminProfile = profile;
              this.formSubmittedMessage = 'Admin added Successfully';
              this.backToAdminPanel();
            },
            error:(err)=>{
              this.errorMessage='Failed to add the admin check the details before trying again'
            }
          }
        )
      }

    } else {
      this.errorMessage = 'Please correct the errors in the form before submitting.';
    }
  }

  backToAdminPanel() {
      this.backToAdminPanelClicked.emit('');
  }

}
