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
  isProfileMenuVisible: boolean = false;  // Controls visibility of the profile menu
  showDoctorProfile: boolean = false;     // Controls visibility of doctor profile
  editDoctorProfile: boolean = false;
  user: User | null=null;
  @ViewChild(AppointmentListComponent) appointmentListComponent!: AppointmentListComponent;


  constructor(private usersharedservice:UsersharedService, private router: Router,private appointmentshareservice:AppointmentService  ) {}

  ngOnInit(): void {
    this.user=this.usersharedservice.getCurrentUser();
    if(this.user == null){
      this.router.navigate(['login'])
    }
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


