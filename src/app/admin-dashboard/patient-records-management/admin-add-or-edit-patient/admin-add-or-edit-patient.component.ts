import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Patient} from '../../../services/interfaces/patientoverview/patientoverview.interface';
import {AdminPatientService} from '../../../services/admin/admin-patient/admin-patient.service';

@Component({
  selector: 'admin-add-or-edit-patient',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgIf,
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './admin-add-or-edit-patient.component.html',
  styleUrl: './admin-add-or-edit-patient.component.css'
})
export class AdminAddOrEditPatientComponent implements OnInit {
  patientProfile!: Patient;
  patientProfileForm: FormGroup;
  formSubmittedMessage:String = '';
  patientid: number = -1;
  userid: number = -1;
  private _errorMessage: string = '';
  timeoutHandle: any;
  @Input() mode: 'add' | 'edit' = 'edit';
  // Setter for errorMessage
  @Input() patient!: Patient;
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

  constructor(private adminPatientService: AdminPatientService, private fb: FormBuilder) {
    this.patientProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      street: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      phone: ['', [Validators.pattern('^\\+?[0-9]{10,15}$')]]
    });
  }

  ngOnInit(): void {
    if(this.mode=='edit') {
      this.patientProfile = this.patient;
      this.patientid = this.patientProfile.id;
      this.userid = this.patientProfile.userid;
      this.patientProfileForm = this.fb.group({
        firstName: [this.patientProfile.firstName],
        lastName: [this.patientProfile.lastName],
        email: [''],
        phone: [this.patientProfile.phone, [Validators.pattern('^\\+?[0-9]{10,15}$')]],
        street: [this.patientProfile.address.street],
        city: [this.patientProfile.address.city],
        state: [this.patientProfile.address.state],
        postalCode: [this.patientProfile.address.postalCode]
      })
    }
  }




  submitPatientProfile(): void {
    if (this.patientProfileForm.valid) {
      const patientdetails: any = {
        id:  this.mode=='edit'?this.patientid:'',
        userid: this.mode=='edit'?this.userid:'',
        email: this.patientProfileForm.value.email,
        firstName: this.patientProfileForm.value.firstName,
        lastName: this.patientProfileForm.value.lastName,
        phone: this.patientProfileForm.value.phone,
        isActive:this.patientProfile?.isActive?this.patientProfile?.isActive:true,
        address:{
          street: this.patientProfileForm.value.street,
          city: this.patientProfileForm.value.city,
          state: this.patientProfileForm.value.state,
          postalCode: this.patientProfileForm.value.postalCode,
        }
      };

      if(this.mode=='edit') {
        this.adminPatientService.updatePatient(patientdetails).subscribe({
          next: (profile) => {
            this.patientProfile = profile;
            this.formSubmittedMessage = 'Patient Updated Successfully';
            this.backToAdminPanel();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update the patient check the details before trying again';
          }
        });
      }
      else {
        this.adminPatientService.registerPatient(patientdetails).subscribe(
          {
            next:(profile) => {
              this.patientProfile = profile;
              this.formSubmittedMessage = 'Patient added Successfully';
              this.backToAdminPanel();
            },
            error:(err)=>{
              this.errorMessage='Failed to add the patient check the details before trying again'
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
