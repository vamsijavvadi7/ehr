import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminAddOrEditPatientComponent} from './admin-add-or-edit-patient/admin-add-or-edit-patient.component';
import {AdminPatientService} from '../../services/admin/admin-patient/admin-patient.service';
import {Patient} from '../../services/interfaces/patientoverview/patientoverview.interface';


@Component({
  selector: 'app-admin-patient-records',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminAddOrEditPatientComponent],
  templateUrl: './patient-records.component.html',
  styleUrl: './patient-records.component.css'
})
export class PatientRecordsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  isModalOpen = false;
  mode: "add" | "edit"='edit';
  editPatient!:Patient;



  constructor(private patientService: AdminPatientService) {}

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.isLoading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.applyFilter();
        this.totalPages = Math.ceil(this.patients.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredPatients = this.patients
      .filter(
        (doc) =>
          doc.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  sortBy(field: keyof Patient): void {
    this.filteredPatients.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilter();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }


  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          alert('Patient deleted successfully.');
          this.fetchPatients();
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
        }
      });
    }
  }




  openAddPatientModal(): void {
    this.mode='add'
    this.isModalOpen = true;
  }

  openEditPatientModal(patient: Patient): void {
    this.editPatient=patient
    this.mode='edit'
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  handleChildEvent() {
    if (this.mode=='edit') {
      alert('Patient edited successfully.');
      this.fetchPatients();
    }
    else {
      alert('Patient added successfully.');
      this.fetchPatients();
    }
   this.closeModal();
  }
}
