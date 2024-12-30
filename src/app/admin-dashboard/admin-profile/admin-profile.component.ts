
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from '../../loading/loading.component';
import {UsersharedService} from '../../services/login/usershared.service';
import {AdminService} from '../../services/admin/admin.service';
import {Admin} from '../../services/interfaces/admin/admin-profile.interface';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinner,
    MatIconModule,
    LoadingComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  adminProfile?: Admin;
  userid: number = -1;
  private _errorMessage: string = '';
  timeoutHandle: any;

  // Getter for errorMessage
  get errorMessage(): string {
    return this._errorMessage;
  }

  // Setter for errorMessage
  set errorMessage(value: string) {
    this._errorMessage = value;

    if (value) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = setTimeout(() => {
        this._errorMessage = '';
      }, 5000);
    }
  }

  constructor(
    private adminService: AdminService,
    private userSharedService: UsersharedService,
  ) {
  }

  ngOnInit(): void {
    this.userid = this.userSharedService.getCurrentUser()!.id;

    this.adminService.getAdminByUserId(this.userid).subscribe({
      next: (profile) => {
        this.adminProfile = profile;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch admin profile';
      },
    });
  }

}
