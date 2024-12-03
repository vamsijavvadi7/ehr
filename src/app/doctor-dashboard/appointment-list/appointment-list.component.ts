import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Appointment } from '../../services/interfaces/doctorappointment.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {AppointmentService} from '../../services/patientoverview/appointmentshare.service';
import {PatientoverviewService} from '../../services/patientoverview/patientoverview.service';
import {Subscription} from 'rxjs';
import {PatientoverviewComponent} from '../patientoverview/patientoverview.component';
import {LoadingComponent} from '../../loading/loading.component';
import {UsersharedService} from '../../services/login/usershared.service';
import {User} from '../../services/interfaces/loginInterface/user.interface';
import {Doctor} from '../../services/interfaces/doctor-profile.interface';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    ReactiveFormsModule, ReactiveFormsModule, MatError, MatOption, MatFormField, MatInput, MatLabel, MatButton, PatientoverviewComponent, LoadingComponent, FormsModule],  // Add CommonModule here if needed
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];  // Array to store appointments
  appointmentForm: FormGroup = new FormGroup({});
  showPatientOverview: boolean = false;
  appointmentsLoaded: boolean = true;
  filteredAppointments: Appointment[] = [];
  selectedStatus: string = 'Scheduled';
  user: User | null | undefined;
  private subscriptions = new Subscription();
  private doctorProfile!: Doctor;
  private doctorprofileloaded: boolean=false;
  private _errorMessage: string = '';
  @ViewChild(PatientoverviewComponent) patientOverview!: PatientoverviewComponent;


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

  constructor(
    private doctorService: DoctorService,
    private usersharedservice:UsersharedService,
    private appointmentshareService:AppointmentService,
    private patientoverviewService: PatientoverviewService,
    private fb: FormBuilder // Inject FormBuilder for form creation
  ) {}

  ngOnInit(): void {
    this.user=this.usersharedservice.getCurrentUser();
    this.doctorprofileloaded=false;
    // @ts-ignore
    if(this.user!=null) {
      // @ts-ignore
      this.doctorService.getDoctorProfile(this.user.id).subscribe({
        next: (profile) => {
          this.doctorProfile = profile;
          this.doctorprofileloaded = true;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch your profile, Sorry doctor!';
        }
      });
    }
    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date();
    // Set form with dynamic date and default start/end times
    this.appointmentForm = this.fb.group({
      date: [today],  // Default to today's date
      startTime: ['09:00'],  // Default start time
      endTime: ['17:00'],    // Default end time
    });
    // Subscribe to showPatientOverview to keep it in sync with the service
    this.subscriptions.add(
      this.appointmentshareService.showPatientOverview$.subscribe((showOverview) => {
        this.showPatientOverview = showOverview;
      })
    );
    if(this.doctorprofileloaded)
    this.onSubmit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Unsubscribes from all added subscriptions
  }

  triggerBackButtonClick(): void {
    if (this.patientOverview) {
      this.patientOverview.onBackButtonClick();
    }
  }

  // Method to handle form submission
  onSubmit(): void {
    const formValues = this.appointmentForm.value;

      // Call the service to fetch appointments based on the form values
      this.appointmentsLoaded = false;
      const selectedDate = formValues.date instanceof Date ? formValues.date : new Date(formValues.date);
      const subscription = this.doctorService
        .getDoctorAppointments(
          this.doctorProfile?.id,
          selectedDate.toISOString().split('T')[0],
          formValues.startTime,
          formValues.endTime
        )
        .subscribe({

          next: (appointments) => {

            this.appointments = appointments as Appointment[];

            this.appointments.forEach((appointment) => {
              if (appointment.patientId) {
                this.subscriptions.add(
                  this.patientoverviewService.getPatientPersonalDetails(appointment.patientId).subscribe({
                    next: (data) => {
                      appointment.patient = data; // Assign the returned Patient data
                    },
                    error: (error) => this.errorMessage = `Error fetching patient details for appointment ${appointment.id}`
                  })
                );
              }
            });

            this.filteredAppointments = [...this.appointments];
            this.filterAppointments();
            setTimeout(() => {
              this.appointmentsLoaded = true;
            }, 3000);

          },
          error: (err) => {
            this.errorMessage = 'A Technical error occurred while fetching appointments';
          }
        });
      this.subscriptions.add(subscription);


  }

  filterAppointments(): void {
    if (this.selectedStatus === 'All') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(
        appointment => appointment.status === this.selectedStatus
      );
    }
  }
  viewAppointmentDetails(appointment: Appointment): void {
    this.appointmentshareService.setSelectedAppointment(appointment);
    // Set the flag to show the patient overview
    this.appointmentshareService.setShowPatientOverview(true);
  }
}
