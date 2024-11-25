import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Doctor} from './interfaces/doctor-profile.interface';
import {Appointment} from './interfaces/doctorappointment.interface';
// movie.service.ts

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8764/doctorservice';  // Base API URL
  //private apiUrl = 'http://localhost:8001';  // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch doctor profile by doctorId
  getDoctorProfile(userId: number): Observable<Doctor> {
    return this.http.get(`${this.apiUrl}/doctor/userid/${userId}`) as Observable<Doctor>;
  }

  updateDoctorProfile(Doctor: Doctor): Observable<Doctor> {
    return this.http.put(`${this.apiUrl}/doctor/update`, Doctor) as Observable<Doctor>;
  }
  // Fetch doctor's appointments using GET with query params

  getDoctorAppointments(doctorId: number, date: string, startTime: string, endTime: string):Observable<Appointment[]> {


    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('date', date)  // format: 'yyyy-MM-dd'
      .set('startTime', startTime)  // format: 'HH:mm'
      .set('endTime', endTime);  // format: 'HH:mm'

    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/appointments`, { params });
  }


}
