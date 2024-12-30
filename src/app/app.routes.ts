import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ResetpasswordComponent} from './login/resetpassword/resetpassword.component';
import {AdminDashboardComponent} from './admin-dashboard/dashboard/dashboard.component';
import {DoctorDashboardComponent} from './doctor-dashboard/doctor-dashboard.component';
import {LoadingComponent} from './loading/loading.component';
import {AdminProfileComponent} from './admin-dashboard/admin-profile/admin-profile.component';
import {EditAdminProfileComponent} from './admin-dashboard/edit-admin-profile/edit-admin-profile.component';
import {DoctorManagementComponent} from './admin-dashboard/doctor-management/doctor-management.component';
import {PatientRecordsComponent} from './admin-dashboard/patient-records-management/patient-records.component';
import {
  AdminAddOrEditDoctorComponent
} from './admin-dashboard/doctor-management/admin-add-or-edit-doctor/admin-add-or-edit-doctor.component';
import {AdminManagementComponent} from './admin-dashboard/admin-management/admin-management.component';
import {
  AppointmentSchedulingComponent
} from './admin-dashboard/appointment-scheduling/appointment-scheduling.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'doctordashboard',component: DoctorDashboardComponent
  },
  {
    path:'forgot-password',component:ResetpasswordComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'appointment-scheduling', pathMatch: 'full' },
      { path: 'admin-profile', component: AdminProfileComponent },
      { path: 'edit-admin-profile', component: EditAdminProfileComponent },
      {path:'manage-doctors',component:DoctorManagementComponent},
      {path:'patient-records',component:PatientRecordsComponent},
      {path:'manage-admins',component:AdminManagementComponent},
      {path:'appointment-scheduling', component:AppointmentSchedulingComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})

export class AppRoutingModule {}
