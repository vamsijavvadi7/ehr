import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Doctor} from '../../interfaces/doctor-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminDoctorManagementService {

  private baseUrl = 'http://localhost:8764/admin/admin-doctor';

  constructor(private http: HttpClient) {}

  /**
   * Delete a doctor by ID.
   * @param id The ID of the doctor to delete.
   * @returns Observable with the response.
   */
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  /**
   * Create a new doctor.
   * @param doctor The doctor data transfer object.
   * @returns Observable with the response.
   */
  createDoctor(doctor: Doctor): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, doctor);
  }

  /**
   * Update doctor details.
   * @param doctor The doctor personal details data transfer object.
   * @returns Observable with the response.
   */
  updateDoctor(doctor: Doctor): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, doctor);
  }

  /**
   * Get a list of all doctors.
   * @returns Observable with the list of doctors.
   */
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get(`${this.baseUrl}/allDoctors`) as Observable<Doctor[]>;
  }

  /**
   * Get available doctors based on the provided availability details.
   * @param availabilityDto The doctor availability data transfer object.
   * @returns Observable with the list of available doctors.
   */
  getAvailableDoctors(availabilityDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/availableDoctors`, availabilityDto);
  }

  /**
   * Get available doctors profile
   * @param userid
   * @returns Observable with Doctor Profile.
   */
  getDoctorProfile(userid: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/userid/{userid}`);
  }



}