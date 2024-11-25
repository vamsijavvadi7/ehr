import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service'
import { Doctor } from '../../services/interfaces/doctor-profile.interface';
import {DoctorDashboardComponent} from '../doctor-dashboard.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {LoadingComponent} from '../../loading/loading.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UsersharedService} from '../../services/login/usershared.service';


@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinner,
    MatIconModule, LoadingComponent, ReactiveFormsModule,],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})

export class DoctorProfileComponent implements OnInit {
  doctorProfile?: Doctor;
  doctorProfileForm: FormGroup;
  doctorid:number = -1;
  userid:number=-1;
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

  constructor(private doctorService: DoctorService,private usersharedservice:UsersharedService,private doctorDashboard: DoctorDashboardComponent,private fb: FormBuilder) {
    this.doctorProfileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['',[Validators.email]],
      specialization: [''],
      phone: ['', [Validators.pattern('^\\+?[0-9]{10,15}$')]],
      availableDays: [''],
        availableFrom: [''],
        availableUntil: ['']
    });
  }

  ngOnInit(): void {
    this.userid=this.usersharedservice.getCurrentUser()!.id;
    this.doctorService.getDoctorProfile(this.userid).subscribe({
      next: (profile) => {
        this.doctorProfile = profile;
        this.doctorid=this.doctorProfile.id;
      },
      error: (err) => {
        this.errorMessage='Failed to fetch doctor profile';
      }
    });
  }

  // Helper method to format the time with AM/PM
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format, using 12 instead of 0
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

  backToAppointments() {
    this.doctorDashboard.backToAppointments();
  }



}
