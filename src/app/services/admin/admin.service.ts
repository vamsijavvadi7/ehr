
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Appointment} from '../interfaces/doctorappointment.interface';
import {Admin} from '../interfaces/admin/admin-profile.interface';

// movie.service.ts

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8764/admin';

  constructor(private http: HttpClient) {}

  // Fetch doctor profile by doctorId
  getAdminProfile(userId: number): Observable<Admin> {
    return this.http.get(`${this.apiUrl}/admins/userid/${userId}`) as Observable<Admin>;
  }

  updateAdminProfile(Admin:Admin): Observable<any> {
    return this.http.put(`${this.apiUrl}/admins/update`, Admin) as Observable<any>;
  }

  // getDoctorAppointments(doctorId: number, date: string, startTime: string, endTime: string):Observable<Appointment[]> {
  //   const params = new HttpParams()
  //     .set('doctorId', doctorId.toString())
  //     .set('date', date)  // format: 'yyyy-MM-dd'
  //     .set('startTime', startTime)  // format: 'HH:mm'
  //     .set('endTime', endTime);  // format: 'HH:mm'
  //   return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/appointments`, { params });
  // }


}
