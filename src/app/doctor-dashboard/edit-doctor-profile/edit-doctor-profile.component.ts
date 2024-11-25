import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from '../../loading/loading.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DoctorService} from '../../services/doctor.service';
import {DoctorDashboardComponent} from '../doctor-dashboard.component';
import {Doctor} from '../../services/interfaces/doctor-profile.interface';
import {UsersharedService} from '../../services/login/usershared.service';

@Component({
  selector: 'app-edit-doctor-profile',
  standalone: true,
  imports: [
    LoadingComponent,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    NgIf,
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './edit-doctor-profile.component.html',
  styleUrl: './edit-doctor-profile.component.css'
})
export class EditDoctorProfileComponent implements OnInit {
  doctorProfile?: Doctor;
  doctorProfileForm: FormGroup;
  formSubmittedMessage:String = '';
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays: Set<string> = new Set();
  doctorid: number = 2;
  userid: number = 3;
  private _errorMessage: string = '';
  timeoutHandle: any;

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

  constructor(private doctorService: DoctorService, private doctorDashboard: DoctorDashboardComponent, private fb: FormBuilder,private userservice:UsersharedService) {
    this.doctorProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      specialization: [''],
      phone: ['', [Validators.pattern('^\\+?[0-9]{10,15}$')]],
      availableDays: [''],
      availableFrom: [''],
      availableUntil: ['']
    });
  }

  ngOnInit(): void {
    this.userid=this.userservice.getCurrentUser()!.id;
    this.doctorService.getDoctorProfile(this.userid).subscribe({
      next: (profile) => {
        this.doctorProfile = profile;
        this.doctorid=this.doctorProfile.id;
        this.doctorProfileForm = this.fb.group({
          firstName: [this.doctorProfile.firstName],
          lastName: [this.doctorProfile.lastName],
          email: [''],
          specialization: [this.doctorProfile.specialization],
          phone: [this.doctorProfile.phone],
          availableDays: [this.doctorProfile.availability.availableDays],
          availableFrom: [this.doctorProfile.availability.availableFrom],
          availableUntil: [this.doctorProfile.availability.availableUntil]
        })
        const daysstring=profile.availability.availableDays;
        this.populateSelectedDays(daysstring);
      },
      error: (err) => {
        this.errorMessage='Failed to fetch doctor profile';
      }
    });
  }

  backToAppointments() {
    this.doctorDashboard.backToAppointments();
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
      const updatedProfile: Doctor = {
        id: this.doctorid,
        userid: this.userid,
        email: this.doctorProfileForm.value.email,
        firstName: this.doctorProfileForm.value.firstName,
        lastName: this.doctorProfileForm.value.lastName,
        specialization: this.doctorProfileForm.value.specialization,
        phone: this.doctorProfileForm.value.phone,
        availability: {
          availableDays: daysString,
          availableFrom: this.doctorProfileForm.value.availableFrom,
          availableUntil: this.doctorProfileForm.value.availableUntil
        }
      };

      this.doctorService.updateDoctorProfile(updatedProfile).subscribe({
        next: (profile) => {
          this.doctorProfile = profile;
          this.formSubmittedMessage='Profile Updated Successfully';
          this.backToAppointments();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update doctor profile check your details before trying again';
        }
      });
    } else {
      this.errorMessage = 'Please correct the errors in the form before submitting.';
    }
  }




  toggleDaySelection(day: string): void {
    if (this.selectedDays.has(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.has(day);
  }

}
