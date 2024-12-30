import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Patient} from '../../interfaces/patientoverview/patientoverview.interface';
import {Appointment} from '../../interfaces/doctorappointment.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminPatientService {
  private baseUrl = 'http://localhost:8764/admin/adminpatient';

  constructor(private http: HttpClient) {}

  /**
   * Register a new patient.
   * @param patient The patient details to register.
   * @returns Observable with the response.
   */
  registerPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, patient);
  }

  /**
   * Update an existing patient's details.
   * @param patient The updated patient details.
   * @returns Observable with the response.
   */
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, patient);
  }

  /**
   * Delete a patient by ID.
   * @param id The ID of the patient to delete.
   * @returns Observable with the response.
   */
  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get details of a single patient by ID.
   * @param id The ID of the patient.
   * @returns Observable with the patient details.
   */
  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get a list of all patients.
   * @returns Observable with the list of patients.
   */
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/all`);
  }

  /**
   * Book an appointment for a patient.
   * @param appointment The appointment details.
   * @returns Observable with the response.
   */
  bookAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookAppointment`, appointment);
  }
}
