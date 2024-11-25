
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Appointment, Patient, VisitInfo} from '../interfaces/doctorappointment.interface';
import {Diagnosis, FamilyHistory, Prescription} from '../interfaces/medicalrecords/medicalrecords.interface';
@Injectable({
  providedIn: 'root'
})
export class PatientoverviewService {
  private apiUrl = 'http://localhost:8764/doctorservice';  // Base API URL

  constructor(private http: HttpClient) {}


  getPatientPersonalDetails(patientid: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/doctorviewpatientdetails/personaldetails/${patientid}`);
  }


  getPatientDiagnosis(patientid: number): Observable<Diagnosis []> {
    return this.http.get<Diagnosis []>(`${this.apiUrl}/doctorviewpatientdetails/diagnosis/${patientid}`);
  }

  getPatientPrescriptions(patientid: number): Observable<Prescription []> {
    return this.http.get<Prescription []>(`${this.apiUrl}/doctorviewpatientdetails/prescription/${patientid}`);
  }

  getPatientFamilyHistory(patientid: number): Observable<FamilyHistory []> {
    return this.http.get<FamilyHistory []>(`${this.apiUrl}/doctorviewpatientdetails/familyHistory/${patientid}`);
  }


  addFamilyHistory(familyHistoryData: Partial<FamilyHistory>): Observable<FamilyHistory> {
    const url = `${this.apiUrl}/doctorviewpatientdetails/familyHistory`;

    return new Observable<FamilyHistory>((observer) => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other necessary headers here
        },
        body: JSON.stringify(familyHistoryData)
      })
        .then(response => {
          // Response will be opaque in 'no-cors' mode, so you cannot read it
          if (response.ok) {
            observer.next(familyHistoryData as FamilyHistory); // You can return something else or handle the response
            observer.complete();
          } else {
            observer.error('Failed to send data');
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });


  }


  // Method to add Prescription
  addPrescription(prescriptionData: Partial<Prescription>): Observable<Prescription> {
    const url = `${this.apiUrl}/doctorviewpatientdetails/prescription`;
    return this.http.post<Prescription>(url, prescriptionData);
  }

  // Method to add Diagnosis
  addDiagnosis(diagnosisData: Partial<Diagnosis>): Observable<Diagnosis> {
    const url = `${this.apiUrl}/doctorviewpatientdetails/diagnosis`;
    return this.http.post<Diagnosis>(url, diagnosisData);
  }

  addVisitInfo(visitnotesData: VisitInfo): Observable<VisitInfo> {
    const url = `${this.apiUrl}/doctorviewpatientdetails/visitinfo`;
    return this.http.post<VisitInfo>(url, visitnotesData);
  }

  getPatientPreviousVisits(patientid: number): Observable<Appointment []> {
    return this.http.get<Appointment []>(`${this.apiUrl}/doctorviewpatientdetails/previousvisitinfo/${patientid}`);
  }

}
