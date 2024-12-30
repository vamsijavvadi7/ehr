import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../interfaces/admin/admin-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8764/admin/admins'; // Base URL for admin-related API calls

  constructor(private http: HttpClient) {}

  /**
   * Create a new admin.
   * @param admin - Admin details to be created
   * @returns Observable of the created Admin object
   */
  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/createAdmin`, admin);
  }

  /**
   * Get all admins.
   * @returns Observable of the list of all Admin objects
   */
  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/getAllAdmins`);
  }

  /**
   * Get admin by User ID.
   * @param userId - User ID of the admin
   * @returns Observable of the Admin object
   */
  getAdminByUserId(userId: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/userid/${userId}`);
  }

  /**
   * Get admin by Admin ID.
   * @param adminId - ID of the admin
   * @returns Observable of the Admin object
   */
  getAdminById(adminId: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/getAdminById/${adminId}`);
  }

  /**
   * Update admin information.
   * @param admin - Updated Admin details
   * @returns Observable of the updated Admin object
   */
  updateAdmin(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/update`, admin);
  }

  /**
   * Delete an admin by ID.
   * @param adminId - ID of the admin to delete
   * @returns Observable of any response
   */
  deleteAdmin(adminId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${adminId}`);
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
