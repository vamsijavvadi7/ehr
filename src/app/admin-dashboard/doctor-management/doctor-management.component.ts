import { Component, OnInit } from '@angular/core';
import {AdminDoctorManagementService} from '../../services/admin/admin-doctor/admin-doctor-management.service';
import {Doctor} from '../../services/interfaces/doctor-profile.interface';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EditDoctorProfileComponent} from '../../doctor-dashboard/edit-doctor-profile/edit-doctor-profile.component';
import {AdminAddOrEditDoctorComponent} from './admin-add-or-edit-doctor/admin-add-or-edit-doctor.component';


@Component({
  selector: 'app-admin-doctor-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EditDoctorProfileComponent, AdminAddOrEditDoctorComponent],
  templateUrl: './doctor-management.component.html',
  styleUrl: './doctor-management.component.css'
})
export class DoctorManagementComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  isModalOpen = false;
  mode: "add" | "edit"='edit';
  editDoctor!:Doctor;



  constructor(private doctorService: AdminDoctorManagementService) {}

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.applyFilter();
        this.totalPages = Math.ceil(this.doctors.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredDoctors = this.doctors
      .filter(
        (doc) =>
          doc.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  sortBy(field: keyof Doctor): void {
    this.filteredDoctors.sort((a, b) => (a[field] > b[field] ? 1 : -1));
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


  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          alert('Doctor deleted successfully.');
          this.fetchDoctors();
        },
        error: (err) => {
          console.error('Error deleting doctor:', err);
        }
      });
    }
  }




  openAddDoctorModal(): void {
    this.mode='add'
    this.isModalOpen = true;
  }

  openEditDoctorModal(doctor: Doctor): void {
    this.editDoctor=doctor
    this.mode='edit'
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  handleChildEvent() {
    if (this.mode=='edit') {
      alert('Doctor edited successfully.');
      this.fetchDoctors();
    }
    else {
      alert('Doctor added successfully.');
      this.fetchDoctors();
    }
   this.closeModal();
  }
}
