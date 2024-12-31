
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Doctor} from '../../interfaces/doctor-profile.interface';
import {DatePipe} from '@angular/common';
import {Doctorpersonalandappointment} from '../../interfaces/admin/doctorpersonalandappointment.interface';
import {Appointment} from '../../interfaces/doctorappointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSchedulingService {

  private baseUrl = 'http://localhost:8764/admin/adminpatient/bookAppointment';

  constructor(private http: HttpClient) {}

  scheduleAppointment(appointmentDto: any): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}`, appointmentDto);
  }

}
