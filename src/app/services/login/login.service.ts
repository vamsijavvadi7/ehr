
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../interfaces/loginInterface/user.interface';

// movie.service.ts

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8764/users';  // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch user profile details
  loginUser(login: { email: any; password: any; }): Observable<User> {
    // Construct the JSON object to send as the body
    const body = {
      password: login.password // Only the password in the body
    };

    // Send the email as a query parameter and the password as part of the JSON body
    return this.http.post<User>(`${this.apiUrl}/users/login`, body, {
      params: { email: login.email }
    });
  }


  updatePassword(details: { email: any; password: any; }): Observable<String> {
    // Construct the JSON object to send as the body
    const body = {
      password: details.password // Only the password in the body
    };
    // Send the email as a query parameter and the password as part of the JSON body
    return this.http.post<String>(`${this.apiUrl}/users/reset-password`, body, {
      params: { email: details.email },responseType: 'text' as 'json'
    });
  }

  sendOtp(email: string): Observable<string> {
    const url = `${this.apiUrl}/auth/send-otp`;
    const params = { email };
    return this.http.post<string>(url, {}, { params,responseType: 'text' as 'json' });
  }

  validateOtp(email: string, otp: string): Observable<string> {
    const url = `${this.apiUrl}/auth/validate-otp`;
    const params = { email, otp };
    return this.http.post<string>(url, {}, { params, responseType: 'text' as 'json' });
  }

}
