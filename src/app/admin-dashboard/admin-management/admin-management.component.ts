import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminAddOrEditAdminComponent} from './admin-add-or-edit-admin/admin-add-or-edit-admin.component';
import {Admin} from '../../services/interfaces/admin/admin-profile.interface';
import {AdminService} from '../../services/admin/admin.service';

@Component({
  selector: 'app-admin-admin-records',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminAddOrEditAdminComponent],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})

export class AdminManagementComponent implements OnInit {
  admins: Admin[] = [];
  filteredAdmins: Admin[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  isModalOpen = false;
  mode: "add" | "edit"='edit';
  editAdmin!:Admin;



  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.applyFilter();
        this.totalPages = Math.ceil(this.admins.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching admins:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredAdmins = this.admins
      .filter(
        (doc) =>
          doc.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  sortBy(field: keyof Admin): void {
    // @ts-ignore
    this.filteredAdmins.sort((a, b) => (a[field] > b[field] ? 1 : -1));
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


  deleteAdmin(id: number): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(id).subscribe({
        next: () => {
          alert('Admin deleted successfully.');
          this.fetchAdmins();
        },
        error: (err) => {
          console.error('Error deleting admin:', err);
        }
      });
    }
  }




  openAddAdminModal(): void {
    this.mode='add'
    this.isModalOpen = true;
  }

  openEditAdminModal(admin: Admin): void {
    this.editAdmin=admin
    this.mode='edit'
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  handleChildEvent() {
    if (this.mode=='edit') {
      alert('Admin edited successfully.');
      this.fetchAdmins();
    }
    else {
      alert('Admin added successfully.');
      this.fetchAdmins();
    }
   this.closeModal();
  }
}
