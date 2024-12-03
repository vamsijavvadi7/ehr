import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from '../../loading/loading.component';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent],
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent {
  step: number = 1; // 1: Email, 2: OTP, 3: Password Reset
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  _errorMessage: string = '';
  timeoutHandle: any;
  _loadingmessage: string = '';

  // Getter for errorMessage
  get errorMessage(): string {
    return this._errorMessage;
  }

  // Setter for errorMessage
  set errorMessage(value: string) {
    this._errorMessage = value;

    if (value) {
      // Clear any existing timeout to avoid multiple timers
      clearTimeout(this.timeoutHandle);

      // Set a timeout to clear the message after 4 seconds
      this.timeoutHandle = setTimeout(() => {
        this._errorMessage = '';
      }, 4000);
    }
  }



  // Getter for successMessage
  get loadingmessage(): string {
    return this._loadingmessage;
  }

  // Setter for successMessage
  set loadingmessage(value: string) {
    this._loadingmessage = value;

    if (value) {
      // Clear any existing timeout to avoid multiple timers
      clearTimeout(this.timeoutHandle);

      // Set a timeout to clear the message after 5 seconds
      this.timeoutHandle = setTimeout(() => {
        this._loadingmessage = '';
      }, 5000);
    }
  }

  constructor(private loginservice: LoginService, private router: Router) {}

  // Send OTP to the user's email
  sendOtp() {

    if (!this.email) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    this.loadingmessage='Sending Otp to your Email'

    this.loginservice.sendOtp(this.email).subscribe({
      next: () => {
        this.step = 2; // Move to OTP verification step
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error sending OTP. Please try again.';
      }
    });
  }

  // Validate the OTP entered by the user
  validateOtp() {
    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP.';
      return;
    }
    this.loadingmessage='Validating Otp';
    this.loginservice.validateOtp(this.email, this.otp).subscribe({
      next: () => {
        this.step = 3; // Move to password reset step
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid or expired OTP. Please try again.';
      }
    });
  }

  // Reset the password
  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter both new password and confirmation.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    this.loadingmessage='Reseting your password';
    this.loginservice.updatePassword({ email: this.email, password: this.newPassword }).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Navigate to login page
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error resetting password. Please try again.';
      }
    });
  }
}
