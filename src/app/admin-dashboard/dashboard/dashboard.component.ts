
import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {User} from '../../services/interfaces/loginInterface/user.interface';
import {UsersharedService} from '../../services/login/usershared.service';
import {AppointmentService} from '../../services/patientoverview/appointmentshare.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, RouterOutlet, RouterLink],
  standalone: true,
  styleUrls: ['./dashboard.component.css']
})



export class AdminDashboardComponent implements OnInit {
  dashboardCards: any[] = [];
  isProfileMenuVisible: boolean = false;  // Controls visibility of the profile menu
  user: User | null=null;



  constructor(private usersharedservice:UsersharedService, private router: Router ) {
  }

  ngOnInit(): void {
    this.user=this.usersharedservice.getCurrentUser();
    this.setupDashboardCards();
    if(this.user == null){
      this.router.navigate(['login'])
    }
  }
  // Function to toggle the profile menu visibility
  toggleProfileMenu(): void {
    this.isProfileMenuVisible = !this.isProfileMenuVisible;
  }



  setupDashboardCards(): void {
    this.dashboardCards = [
      { title: 'Doctor Management', description: 'Add, remove, or edit doctors', route: 'manage-doctors' },
      { title: 'Patient Records', description: 'View and manage patient records', route: 'patient-records' },
      { title: 'Admin Management', description: 'Add, remove, or edit other admins', route: 'manage-admins' },
      { title: 'Appointment Scheduling', description: 'Book and manage patient appointments', route: 'appointment-scheduling' },
    ];
  }


  logOut(){
    this.usersharedservice.clearUser();
    this.router.navigate(['/login'])
  }

}
