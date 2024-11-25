import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { User } from '../services/interfaces/loginInterface/user.interface';
import {CommonModule} from '@angular/common';
import {UsersharedService} from '../services/login/usershared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  user!: User;
  loginForm: FormGroup;
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
      // Clear any existing timeout to avoid multiple timers
      clearTimeout(this.timeoutHandle);

      // Set a timeout to clear the message after 4 seconds
      this.timeoutHandle = setTimeout(() => {
        this._errorMessage = '';
      }, 5000);
    }
  }
  constructor(private loginservice: LoginService, private router: Router,private fb: FormBuilder,private userservice:UsersharedService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  ngOnInit(): void {

    if(this.userservice.getCurrentUser()!=undefined){
     this.router.navigateByUrl('/doctordashboard');
    }

  }




  onSubmit() {
    if (this.loginForm.valid) {
      this.loginservice.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
            // Handle successful user retrieval
            this.user=response;
            this.userservice.setUser(this.user);

            if (this.user.role === 'doctor') {
              this.router.navigate(['/doctordashboard']);
            } else {
              this.errorMessage='incorrect credentials';
            }
        },
        error: (err) => {
          this.errorMessage='Failed to get user details try again'
        }
      });
    } else {
      this.errorMessage='Please enter a valid email and password';
    }
  }


}
