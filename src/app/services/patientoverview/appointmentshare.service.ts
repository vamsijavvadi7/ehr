import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment } from '../interfaces/doctorappointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  // BehaviorSubject to store the selected appointment
  private selectedAppointmentSubject = new BehaviorSubject<Appointment | null>(this.loadSelectedAppointmentFromLocalStorage());
  selectedAppointment$ = this.selectedAppointmentSubject.asObservable();

  // BehaviorSubject to store the showPatientOverview flag
  private showPatientOverviewSubject = new BehaviorSubject<boolean>(this.loadShowPatientOverviewFromLocalStorage());
  showPatientOverview$ = this.showPatientOverviewSubject.asObservable();

  constructor() {
    // Initialize the service with the values from localStorage
    const savedAppointment = this.loadSelectedAppointmentFromLocalStorage();
    const savedShowPatientOverview = this.loadShowPatientOverviewFromLocalStorage();

    if (savedAppointment) {
      this.selectedAppointmentSubject.next(savedAppointment);
    }
    this.showPatientOverviewSubject.next(savedShowPatientOverview);
  }

  // Method to set the selected appointment and save it in localStorage
  setSelectedAppointment(appointment: Appointment): void {
    this.selectedAppointmentSubject.next(appointment);
    this.saveSelectedAppointmentToLocalStorage(appointment);
  }

  // Method to set the showPatientOverview flag and save it in localStorage
  setShowPatientOverview(show: boolean): void {
    this.showPatientOverviewSubject.next(show);
    this.saveShowPatientOverviewToLocalStorage(show);
  }

  // Save selected appointment to localStorage
  private saveSelectedAppointmentToLocalStorage(appointment: Appointment | null): void {
    if (appointment) {
      localStorage.setItem('selectedAppointment', JSON.stringify(appointment));
    } else {
      localStorage.removeItem('selectedAppointment');
    }
  }

  // Save showPatientOverview flag to localStorage
  private saveShowPatientOverviewToLocalStorage(show: boolean): void {
    localStorage.setItem('showPatientOverview', JSON.stringify(show));
  }

  // Load selected appointment from localStorage
  private loadSelectedAppointmentFromLocalStorage(): Appointment | null {
    const storedAppointment = localStorage.getItem('selectedAppointment');
    return storedAppointment ? JSON.parse(storedAppointment) : null;
  }

  // Load showPatientOverview flag from localStorage
  private loadShowPatientOverviewFromLocalStorage(): boolean {
    const storedFlag = localStorage.getItem('showPatientOverview');
    return storedFlag ? JSON.parse(storedFlag) : false;
  }


  clearSelectedAppointment(): void {
    localStorage.removeItem('selectedAppointment');
    this.selectedAppointmentSubject.next(null);
  }

  clearShowPatientOverview(): void {
    localStorage.removeItem('showPatientOverview');
    this.showPatientOverviewSubject.next(false);
  }
}
