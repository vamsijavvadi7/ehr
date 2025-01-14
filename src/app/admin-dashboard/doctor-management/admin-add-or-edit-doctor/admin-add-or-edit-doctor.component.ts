import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Doctor} from '../../../services/interfaces/doctor-profile.interface';
import {AdminDoctorManagementService} from '../../../services/admin/admin-doctor/admin-doctor-management.service';

@Component({
  selector: 'admin-add-or-edit-doctor',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgIf,
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './admin-add-or-edit-doctor.component.html',
  styleUrl: './admin-add-or-edit-doctor.component.css'
})
export class AdminAddOrEditDoctorComponent implements OnInit {
  doctorProfile!: Doctor;
  doctorProfileForm: FormGroup;
  formSubmittedMessage:String = '';
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: Set<string> = new Set();
  doctorid: number = -1;
  userid: number = -1;
  private _errorMessage: string = '';
  timeoutHandle: any;
  @Input() mode: 'add' | 'edit' = 'edit';
  @Input() doctor!: Doctor;
  @Output() backToAdminPanelClicked = new EventEmitter<string>();

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

  constructor(private adminDoctorService: AdminDoctorManagementService, private fb: FormBuilder) {
    this.doctorProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      specialization: [''],
      phone: ['', [Validators.pattern('^\\+?[0-9]{10,15}$')]],
      availableDays: [''],
      availableFrom: [''],
      availableUntil: ['']
    });
  }

  ngOnInit(): void {
    if(this.mode=='edit') {
      this.doctorProfile = this.doctor;
      this.doctorid = this.doctorProfile.id;
      this.userid = this.doctorProfile.userid;
      this.doctorProfileForm = this.fb.group({
        firstName: [this.doctorProfile.firstName],
        lastName: [this.doctorProfile.lastName],
        email: [''],
        specialization: [this.doctorProfile.specialization],
        phone: [this.doctorProfile.phone, [Validators.pattern('^\\+?[0-9]{10,15}$')]],
        availableDays: [this.doctorProfile.availability.availableDays],
        availableFrom: [this.doctorProfile.availability.availableFrom],
        availableUntil: [this.doctorProfile.availability.availableUntil],
      })

      const daysstring = this.doctorProfile.availability.availableDays;
      this.populateSelectedDays(daysstring);
    }
    // this.adminDoctorService.getDoctorProfile(this.userid).subscribe({
    //   next: (profile) => {
    //
    //   },
    //   error: (err) => {
    //     this.errorMessage='Failed to fetch doctor details';
    //   }
    // });
  }


  populateSelectedDays(daysString: string): void {
    if (daysString) {
      const daysArray = daysString.split(','); // Split the string into an array
      daysArray.forEach(day => {
        if (this.days.includes(day.trim())) {
          this.selectedDays.add(day.trim()); // Add each valid day to the set
        }
      });
    }
  }



  submitDoctorProfile(): void {
    if (this.doctorProfileForm.valid) {
      const daysString =  Array.from(this.selectedDays)
        .sort((a, b) => this.days.indexOf(a) - this.days.indexOf(b))
        .join(', ');
      const doctordetails: any = {
        id:  this.mode=='edit'?this.doctorid:'',
        userid: this.mode=='edit'?this.userid:'',
        email: this.doctorProfileForm.value.email,
        firstName: this.doctorProfileForm.value.firstName,
        lastName: this.doctorProfileForm.value.lastName,
        specialization: this.doctorProfileForm.value.specialization,
        phone: this.doctorProfileForm.value.phone,
        isActive:this.mode=='edit'?this.doctorProfile!.isActive:true,
        availability: {
          availableDays: daysString,
          availableFrom: this.doctorProfileForm.value.availableFrom,
          availableUntil: this.doctorProfileForm.value.availableUntil
        }
      };
      if(this.mode=='edit') {
        this.adminDoctorService.updateDoctor(doctordetails).subscribe({
          next: (profile) => {
            this.doctorProfile = profile;
            this.formSubmittedMessage = 'Doctor Updated Successfully';
            this.backToAdminPanel();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update the doctor check the details before trying again';
          }
        });
      }
      else {
        this.adminDoctorService.createDoctor(doctordetails).subscribe(
          {
            next:(profile) => {
              this.doctorProfile = profile;
              this.formSubmittedMessage = 'Doctor added Successfully';
              this.backToAdminPanel();
            },
            error:(err)=>{
              this.errorMessage='Failed to add the doctor check the details before trying again'
            }
          }
        )
      }

    } else {
      this.errorMessage = 'Please correct the errors in the form before submitting.';
    }
  }




  toggleDaySelection(day: string): void {
    if (this.isDaySelected(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.has(day);
  }


  backToAdminPanel() {
      this.backToAdminPanelClicked.emit('');
  }

}
