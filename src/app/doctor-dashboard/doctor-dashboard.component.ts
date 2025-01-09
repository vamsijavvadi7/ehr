import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { CommonModule } from '@angular/common';
import {PatientoverviewComponent} from './patientoverview/patientoverview.component';
import {EditDoctorProfileComponent} from './edit-doctor-profile/edit-doctor-profile.component';
import {UsersharedService} from '../services/login/usershared.service';
import {Router} from '@angular/router';
import {User} from '../services/interfaces/loginInterface/user.interface';
import {AppointmentService} from '../services/patientoverview/appointmentshare.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Appointment} from '../services/interfaces/doctorappointment.interface';
@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    DoctorProfileComponent,
    AppointmentListComponent, CommonModule, PatientoverviewComponent, EditDoctorProfileComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit{
  socketClient:any=null;
  stompClient!: Stomp.Client;
  isProfileMenuVisible: boolean = false;  // Controls visibility of the profile menu
  showDoctorProfile: boolean = false;     // Controls visibility of doctor profile
  editDoctorProfile: boolean = false;
  user: User | null=null;
  @ViewChild(AppointmentListComponent) appointmentListComponent!: AppointmentListComponent;



  constructor(private usersharedservice:UsersharedService, private toasterService:ToastrService, private router: Router,private appointmentshareservice:AppointmentService  ) {}

  ngOnInit(): void {
    this.user=this.usersharedservice.getCurrentUser();
    if(this.user == null){
      this.router.navigate(['login'])
    }

    let socket=new SockJs('http://localhost:8001/ws');


    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
      this.stompClient.subscribe(`/user/2/doctor/appointments`, (message) => {
        // Parse the JSON message body
        const msg = JSON.parse(message.body);
        // Cast the parsed object to the Appointment type
        const appointment: Appointment = msg as Appointment;
        const dateTimeString =appointment.appointmentTime;

        // Create a Date object
        const dateObject = new Date(dateTimeString);

        // Extract and format the date
        const formattedDate = dateObject.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', // Full month name
          day: 'numeric',
        });

// Extract and format the time in 12-hour clock
        const formattedTime = dateObject.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

// Combine the formatted date and time
        const formattedDateTime = `${formattedDate}, ${formattedTime}`;


        this.toasterService.success("New Appointment with "+appointment.patient.firstName+" "+appointment.patient.lastName+" "+formattedDateTime);
      });
    });
  }
  // Function to toggle the profile menu visibility
  toggleProfileMenu(): void {
    this.isProfileMenuVisible = !this.isProfileMenuVisible;

  }

  // Function to view doctor profile
  vieweditDoctorProfile(): void {
    this.editDoctorProfile = true;  // Show the doctor profile component
    this.isProfileMenuVisible = false;  // Hide the profile menu
    this.showDoctorProfile=false;
  }

  // Function to view doctor profile
  viewDoctorProfile(): void {
    this.showDoctorProfile = true;  // Show the doctor profile component
    this.isProfileMenuVisible = false;  // Hide the profile menu
    this.editDoctorProfile=false;
  }

  // Function to go back to appointments view (optional)
  backToAppointments(): void {
    this.showDoctorProfile = false;  // Hide doctor profile and show appointment list
    this.editDoctorProfile = false;
  }

  logOut() {
    this.usersharedservice.clearUser();
    if(!this.showDoctorProfile && !this.editDoctorProfile)
      this.appointmentListComponent.triggerBackButtonClick();
    else
      this.appointmentshareservice.setShowPatientOverview(false);
    this.showDoctorProfile=false;
    this.editDoctorProfile=false;
    this.router.navigate(['login']);
  }
}


