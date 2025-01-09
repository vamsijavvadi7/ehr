import {Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {AdminPatientService} from '../../services/admin/admin-patient/admin-patient.service';
import {Appointment, Patient} from '../../services/interfaces/doctorappointment.interface';
import {Doctorpersonalandappointment} from '../../services/interfaces/admin/doctorpersonalandappointment.interface';
import {AdminDoctorManagementService} from '../../services/admin/admin-doctor/admin-doctor-management.service';
import {AppointmentSchedulingService} from '../../services/admin/appointment-scheduling/appointment-scheduling.service';
import {app} from '../../../../server';
import {LoadingComponent} from '../../loading/loading.component';

@Component({
  selector: 'app-appointment-scheduling',
  templateUrl: './appointment-scheduling.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingComponent
  ],
  styleUrls: ['./appointment-scheduling.component.css']
})
export class AppointmentSchedulingComponent implements OnInit{
  patientSearchQuery: string = '';
  selectedPatient!: Patient;
  selectedDoctor!: Doctorpersonalandappointment;  // Ensures selectedDoctor is of type Doctor
  appointmentDate: string = '';
  selectedTimeSlot: string = '';
  dropdownVisible: boolean = false;
  preventHide: boolean = false; // New flag to prevent dropdown hide


  availableDoctors: Doctorpersonalandappointment[] =[];

  patients: Patient[] = [];


  availableTimeSlots: string[] = [];
  //filteredDoctors: Doctorpersonalandappointment[] = this.availableDoctors;  // Initially all doctors are shown
  adminPatientService=inject(AdminPatientService);
  filteredPatients: Patient[]=this.patients;

  ngOnInit() {

    this.loadPatients();

  }

  constructor(private router:Router,private appointmentService:AppointmentSchedulingService,private  adminDoctorService:AdminDoctorManagementService) {
  }
  loadPatients(){

    this.adminPatientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients=this.patients;
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
      }
    });
  }
  // Search Patient
  searchPatient() {
    if (!this.patients?.length) {
      this.filteredPatients = [];
      return;
    }
    this.filteredPatients = this.patients.filter(patient =>
      patient.firstName?.toLowerCase().includes(this.patientSearchQuery.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(this.patientSearchQuery.toLowerCase())
    );
  }



  // Add New Patient
  addPatient() {
    this.router.navigate(["admin-dashboard/patient-records"])
  }


  loadDoctors() {

    if (!this.appointmentDate) {
      return;
    }
    // Extract day of the week from the appointment date
    // const appointmentDay = new Date(this.appointmentDate).getDay();
    // const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // const dayString = dayNames[appointmentDay];
    //
    //
    //
    // // Filter doctors based on whether they are available on the selected day
    // this.filteredDoctors = this.availableDoctors.filter(doctor =>
    //   doctor.availability.availableDays.includes(dayString)
    // );

    this.adminDoctorService.getAvailableDoctorsByDate(this.appointmentDate).subscribe({
      next: (data) => {
        this.availableDoctors=data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }


  // Get Available Time Slots for Selected Doctor
  getDoctorAvailableSlots() {
    if (!this.selectedDoctor || !this.appointmentDate) {
      return;
    }

    const doctor = this.selectedDoctor;
    const date = new Date(this.appointmentDate).toISOString().split('T')[0]; // Extract date from datetime-local

    if (doctor) {
      const workStart = doctor.availability.availableFrom;
      const workEnd = doctor.availability.availableUntil;
      let slots: string[] = [];
      // Loop through the doctor's working hours in 30-minute intervals
      for (let time = this.convertToMinutes(workStart); time < this.convertToMinutes(workEnd); time += 30) {
        const slotTime = this.convertToTime(time);
        if(slotTime==='12:00' || slotTime==='13:00' || slotTime==='12:30'){
          continue;
        }
        // Check if the slot is already booked
        if (this.isSlotBooked(date, slotTime)) {
          console.log("skipped"+slotTime+date);
          continue;
        }

        slots.push(slotTime);
      }

      this.availableTimeSlots = slots;
    }
  }

  isSlotBooked(date: string, time: string): boolean {
    // Check if any appointment matches the provided date and time
    return this.selectedDoctor.appointment.some(appointment => {
      const appointmentDate = appointment.appointmentTime.split('T')[0] // Convert to Date object
      const appointmentTime = appointment.appointmentTime.split('T')[1].slice(0, 5);
      // Compare normalized date and time
      const isDateMatching = appointmentDate === date;
      const isTimeMatching = appointmentTime === time;

      return isDateMatching && isTimeMatching;
    });
  }

  // Convert time (HH:MM) to minutes
  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(num => parseInt(num));
    return hours * 60 + minutes;
  }

  // Convert minutes back to time (HH:MM)
  convertToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Schedule Appointment
  scheduleAppointment() {


    //console.log(!this.selectedPatient.firstName+" "+ !this.selectedDoctor.firstName+" "+!this.appointmentDate +" "+ !this.selectedTimeSlot);
    if (!this.selectedPatient || !this.selectedDoctor || !this.appointmentDate || !this.selectedTimeSlot) {
      alert('Please fill in all the details');
      return;
    }
    const requestBody={
      doctorId:this.selectedDoctor.id,
      patientId:this.selectedPatient.id,
      appointmentTime:this.createLocalDateTime(this.appointmentDate,this.selectedTimeSlot),
      status: "Scheduled",
      visitInfo: {
      }
    }
    this.appointmentService.scheduleAppointment(requestBody).subscribe(
      {
        next: (data) => {
          console.log('Appointment Scheduled');
        this.resetForm();

        },
        error:(err) => {
          console.log('Unable to Schedule appointment try again...');
        }
      }

    );
  }

  createLocalDateTime(appointmentDate: string, slotTime: string): string {
    // Split the appointment date into components
    const [month, day, year] = appointmentDate.split('-').map(Number);

    // Split the slot time into components
    const [hour, minute] = slotTime.split(':').map(Number);

    // Create a new Date object with local time
    const dateTime = new Date(year, month - 1, day, hour, minute);


    const formattedTime = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`;
    return `${appointmentDate}T${formattedTime}`;
  }



  selectPatient(patient: Patient) {
    this.selectedPatient=patient;
    this.patientSearchQuery=patient.firstName+" "+patient.lastName;
    this.hideDropdown();
  }

  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    if (this.preventHide) return;
    setTimeout(() => {
      this.dropdownVisible = false; // Delay closing to allow click events on the dropdown
    }, 100);
  }
  onDropdownClick() {
    this.preventHide = true; // Set flag when dropdown is clicked
    setTimeout(() => (this.preventHide = false), 200); // Reset flag shortly after
  }

  resetForm() {
    this.patientSearchQuery = '';
    this.selectedPatient = null!;
    this.selectedDoctor = null!;
    this.appointmentDate = '';
    this.selectedTimeSlot = '';
    this.dropdownVisible = false;
    this.preventHide = false;
    this.availableDoctors = [];
    this.patients = [];
    this.availableTimeSlots = [];

    this.loadPatients();
  }

}
