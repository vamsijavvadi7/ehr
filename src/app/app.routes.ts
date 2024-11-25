import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'doctorprofile',
    loadComponent: () =>
      import('./doctor-dashboard/doctor-profile/doctor-profile.component').then(
        (m) => m.DoctorProfileComponent
      ),
  },
  {
    path: 'doctordashboard',
    loadComponent: () =>
      import('./doctor-dashboard/doctor-dashboard.component').then(
        (m) => m.DoctorDashboardComponent
      ),
  },
  {
    path: 'patientoverview/:id',
    loadComponent: () =>
      import('./doctor-dashboard/patientoverview/patientoverview.component').then(
        (m) => m.PatientoverviewComponent
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})

export class AppRoutingModule {}
